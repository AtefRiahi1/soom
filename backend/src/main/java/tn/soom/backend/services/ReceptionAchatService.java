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
public class ReceptionAchatService {
    @Autowired
    private ReceptionAchatRepo receptionAchatRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private FournisseurRepo fournisseurRepo;
    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private MouvementService mouvementService;
    @Autowired
    private FactureAchatRepo factureAchatRepo;

    public ReceptionAchat create(ReceptionAchat receptionAchat, Integer entrepriseId, Integer fournisseurId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Fournisseur fournisseur = fournisseurRepo.findById(fournisseurId)
                .orElseThrow(() -> new IllegalArgumentException("Fournisseur introuvable avec l'ID : " + fournisseurId));

        // Associer les entités
        receptionAchat.setFournisseur(fournisseur);
        receptionAchat.setEntreprise(entreprise);

        // Calculer les totaux
        calculateTotalPrice(receptionAchat);
        calculatePriceHt(receptionAchat);
        calculateTax(receptionAchat);
        calculateNetAmount(receptionAchat);

        // Créer un mouvement pour chaque produit
        for (ReceptionAchat.ProductItem produit : receptionAchat.getProduits()) {
            Mouvement mouvement = new Mouvement();
            mouvement.setNomProduit(produit.getNom());
            mouvement.setQuantite(produit.getQuantite());
            mouvement.setType("ACHAT"); // Toujours de type "achat" pour une réception
            mouvement.setEntreprise(entreprise);
            mouvementService.createMovement(mouvement, entrepriseId, empEmail); // Appel à createMovement
        }

        // Créer une notification
        Notification notification = new Notification();
        notification.setTitle("Nouvelle réception d'achat");
        notification.setMessage("Une nouvelle réception d'achat a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);
        notificationRepo.save(notification);

        // Enregistrer la réception d'achat
        return receptionAchatRepo.save(receptionAchat);
    }

    public ReceptionAchat convertFactureToReception(Integer factureId, String empEmail) {
        FactureAchat factureAchat = factureAchatRepo.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture d'achat introuvable avec l'ID : " + factureId));

        // Créer une nouvelle réception à partir de la facture
        ReceptionAchat receptionAchat = new ReceptionAchat();
        receptionAchat.setNumReception("REC-" + factureAchat.getNumFacture()); // Générer un numéro de réception

        // Convertir et ajouter les produits
        List<ReceptionAchat.ProductItem> receptionProducts = factureAchat.getProduits().stream()
                .map(this::convertToReceptionProductItem)
                .collect(Collectors.toList());
        receptionAchat.setProduits(receptionProducts);

        // Remplir d'autres champs
        receptionAchat.setPriceHt(factureAchat.getPriceHt());
        receptionAchat.setTva(factureAchat.getTva());
        receptionAchat.setTaxe(factureAchat.getTaxe());
        receptionAchat.setNetApayer(factureAchat.getNetApayer());
        receptionAchat.setEntreprise(factureAchat.getEntreprise());
        receptionAchat.setFournisseur(factureAchat.getFournisseur());
        receptionAchat.setCreatedAt(LocalDateTime.now());
        receptionAchat.setUpdatedAt(LocalDateTime.now());

        // Créer un mouvement pour chaque produit
        for (FactureAchat.ProductItem produit : factureAchat.getProduits()) {
            Mouvement mouvement = new Mouvement();
            mouvement.setNomProduit(produit.getNom());
            mouvement.setQuantite(produit.getQuantite());
            mouvement.setType("ACHAT"); // Toujours de type "achat" pour une réception
            mouvement.setEntreprise(factureAchat.getEntreprise());
            mouvementService.createMovement(mouvement, factureAchat.getEntreprise().getId(), empEmail); // Appel à createMovement
        }

        // Créer une notification
        Notification notification = new Notification();
        notification.setTitle("Nouvelle réception d'achat");
        notification.setMessage("Une nouvelle réception d'achat a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(factureAchat.getEntreprise());
        notification.setRead(false);
        notificationRepo.save(notification);

        // Enregistrer la réception dans la base de données
        return receptionAchatRepo.save(receptionAchat);
    }

    private ReceptionAchat.ProductItem convertToReceptionProductItem(FactureAchat.ProductItem factureProductItem) {
        ReceptionAchat.ProductItem receptionProductItem = new ReceptionAchat.ProductItem();
        receptionProductItem.setNom(factureProductItem.getNom());
        receptionProductItem.setQuantite(factureProductItem.getQuantite());
        receptionProductItem.setPrixUnitaire(factureProductItem.getPrixUnitaire());
        receptionProductItem.setPrix_total(factureProductItem.getPrix_total());
        return receptionProductItem;
    }

    public ReceptionAchat findOne(Integer id) {
        return receptionAchatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reception d'achat introuvable avec l'ID : " + id));
    }

    public ReceptionAchat update(Integer id, ReceptionAchat updatedReceptionAchat,String empEmail) {
        Optional<ReceptionAchat> existingReceptionAchat = receptionAchatRepo.findById(id);
        if (existingReceptionAchat.isPresent()) {
            ReceptionAchat receptionAchat = existingReceptionAchat.get();
            receptionAchat.setNumReception(updatedReceptionAchat.getNumReception());
            receptionAchat.setProduits(updatedReceptionAchat.getProduits());
            receptionAchat.setTva(updatedReceptionAchat.getTva());
            calculateTotalPrice(receptionAchat);
            calculatePriceHt(receptionAchat);
            calculateTax(receptionAchat);
            calculateNetAmount(receptionAchat);
            return receptionAchatRepo.save(receptionAchat);
        } else {
            throw new IllegalArgumentException("Reception non trouvé avec l'ID : " + id);
        }
    }

    public void remove(Integer id) {
        receptionAchatRepo.deleteById(id);
    }

    public List<ReceptionAchat> findByEntrepriseId(Integer entrepriseId) {
        return receptionAchatRepo.findByEntrepriseId(entrepriseId);
    }

    private void calculateTotalPrice(ReceptionAchat receptionAchat) {
        receptionAchat.getProduits().forEach(product -> {
            product.setPrix_total(product.getQuantite() * product.getPrixUnitaire());
        });
    }

    private void calculatePriceHt(ReceptionAchat receptionAchat) {
        receptionAchat.setPriceHt(receptionAchat.getProduits().stream()
                .mapToDouble(ReceptionAchat.ProductItem::getPrix_total)
                .sum());
    }

    private void calculateTax(ReceptionAchat receptionAchat) {
        if (receptionAchat.getPriceHt() != null && receptionAchat.getTva() != null) {
            receptionAchat.setTaxe((receptionAchat.getPriceHt() * receptionAchat.getTva()) / 100);
        } else {
            System.err.println("Impossible de calculer la taxe. Assurez-vous que priceHt et tva sont définis.");
        }
    }

    private void calculateNetAmount(ReceptionAchat receptionAchat) {
        if (receptionAchat.getPriceHt() != null && receptionAchat.getTaxe() != null) {
            receptionAchat.setNetApayer(receptionAchat.getPriceHt() + receptionAchat.getTaxe());
        } else {
            System.err.println("Impossible de calculer le montant net. Assurez-vous que priceHt et taxe sont définis.");
        }
    }
}
