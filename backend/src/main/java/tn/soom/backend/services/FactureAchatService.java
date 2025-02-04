package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FactureAchatService {
    @Autowired
    private FactureAchatRepo factureAchatRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private FournisseurRepo fournisseurRepo;
    @Autowired
    private NotificationRepo notificationRepo;
    @Autowired
    private CommandeAchatRepo commandeAchatRepo;

    public FactureAchat create(FactureAchat factureAchat, Integer entrepriseId, Integer fournisseurId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Fournisseur fournisseur = fournisseurRepo.findById(fournisseurId)
                .orElseThrow(() -> new IllegalArgumentException("Fournisseur introuvable avec l'ID : " + fournisseurId));
        factureAchat.setFournisseur(fournisseur);
        factureAchat.setEntreprise(entreprise);
        calculateTotalPrice(factureAchat);
        calculatePriceHt(factureAchat);
        calculateTax(factureAchat);
        calculateNetAmount(factureAchat);
        Notification notification = new Notification();
        notification.setTitle("Nouvelle facture d'achat");
        notification.setMessage("Une nouvelle facture d'achat a été crée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
        return factureAchatRepo.save(factureAchat);
    }

    public FactureAchat convertCommandeToFacture(Integer commandeId, String empEmail) {
        CommandeAchat commandeAchat = commandeAchatRepo.findById(commandeId)
                .orElseThrow(() -> new IllegalArgumentException("Commande d'achat introuvable avec l'ID : " + commandeId));

        // Créer une nouvelle facture à partir de la commande
        FactureAchat factureAchat = new FactureAchat();
        factureAchat.setNumFacture("FCT-" + commandeAchat.getNumCommande()); // Générer un numéro de facture

        // Convertir et ajouter les produits
        List<FactureAchat.ProductItem> factureProducts = commandeAchat.getProduits().stream()
                .map(this::convertToFactureProductItem)
                .collect(Collectors.toList());
        factureAchat.setProduits(factureProducts);

        // Remplir d'autres champs
        factureAchat.setPriceHt(commandeAchat.getPriceHt());
        factureAchat.setTva(commandeAchat.getTva());
        factureAchat.setTaxe(commandeAchat.getTaxe());
        factureAchat.setNetApayer(commandeAchat.getNetApayer());
        factureAchat.setEntreprise(commandeAchat.getEntreprise());
        factureAchat.setFournisseur(commandeAchat.getFournisseur());
        factureAchat.setNomFichier("FCT-" + commandeAchat.getNumCommande() + ".pdf");
        factureAchat.setPaye(false); // Par défaut, la facture n'est pas payée
        factureAchat.setCreatedAt(LocalDateTime.now());
        factureAchat.setUpdatedAt(LocalDateTime.now());
        Notification notification = new Notification();
        notification.setTitle("Nouvelle facture d'achat");
        notification.setMessage("Une nouvelle facture d'achat a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(commandeAchat.getEntreprise());
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);

        // Enregistrer la facture dans la base de données
        return factureAchatRepo.save(factureAchat);
    }

    private FactureAchat.ProductItem convertToFactureProductItem(CommandeAchat.ProductItem commandeProductItem) {
        FactureAchat.ProductItem factureProductItem = new FactureAchat.ProductItem();
        factureProductItem.setNom(commandeProductItem.getNom());
        factureProductItem.setQuantite(commandeProductItem.getQuantite());
        factureProductItem.setPrixUnitaire(commandeProductItem.getPrixUnitaire());
        factureProductItem.setPrix_total(commandeProductItem.getPrix_total());
        return factureProductItem;
    }

    public FactureAchat findOne(Integer id) {
        return factureAchatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture d'achat introuvable avec l'ID : " + id));
    }

    public FactureAchat update(Integer id, FactureAchat updatedFactureAchat,String empEmail) {
        Optional<FactureAchat> existingFactureAchat = factureAchatRepo.findById(id);
        if (existingFactureAchat.isPresent()) {
            FactureAchat factureAchat = existingFactureAchat.get();
            factureAchat.setNumFacture(updatedFactureAchat.getNumFacture());
            factureAchat.setProduits(updatedFactureAchat.getProduits());
            factureAchat.setTva(updatedFactureAchat.getTva());
            calculateTotalPrice(factureAchat);
            calculatePriceHt(factureAchat);
            calculateTax(factureAchat);
            calculateNetAmount(factureAchat);
            return factureAchatRepo.save(factureAchat);
        } else {
            throw new IllegalArgumentException("Facture non trouvé avec l'ID : " + id);
        }
    }

    public void remove(Integer id) {
        factureAchatRepo.deleteById(id);
    }

    public List<FactureAchat> findByEntrepriseId(Integer entrepriseId) {
        return factureAchatRepo.findByEntrepriseId(entrepriseId);
    }

    public FactureAchat updateFactureStatus(Integer factureId) {
        FactureAchat factureAchat = factureAchatRepo.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("facture introuvable avec l'ID : " + factureId));

        factureAchat.setPaye(true);
        factureAchat.setDatePaiement(LocalDateTime.now());
        return factureAchatRepo.save(factureAchat);
    }

    private void calculateTotalPrice(FactureAchat factureAchat) {
        factureAchat.getProduits().forEach(product -> {
            product.setPrix_total(product.getQuantite() * product.getPrixUnitaire());
        });
    }

    private void calculatePriceHt(FactureAchat factureAchat) {
        factureAchat.setPriceHt(factureAchat.getProduits().stream()
                .mapToDouble(FactureAchat.ProductItem::getPrix_total)
                .sum());
    }

    private void calculateTax(FactureAchat factureAchat) {
        if (factureAchat.getPriceHt() != null && factureAchat.getTva() != null) {
            factureAchat.setTaxe((factureAchat.getPriceHt() * factureAchat.getTva()) / 100);
        } else {
            System.err.println("Impossible de calculer la taxe. Assurez-vous que priceHt et tva sont définis.");
        }
    }

    private void calculateNetAmount(FactureAchat factureAchat) {
        if (factureAchat.getPriceHt() != null && factureAchat.getTaxe() != null) {
            factureAchat.setNetApayer(factureAchat.getPriceHt() + factureAchat.getTaxe());
        } else {
            System.err.println("Impossible de calculer le montant net. Assurez-vous que priceHt et taxe sont définis.");
        }
    }
}
