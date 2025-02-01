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
public class FactureService {
    @Autowired
    private FactureRepo factureRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private NotificationRepo notificationRepo;
    @Autowired
    private CommandeRepo commandeRepo;
    @Autowired
    private LivraisonRepo livraisonRepo;

    public Facture create(Facture facture, Integer entrepriseId, Integer clientId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable avec l'ID : " + clientId));
        facture.setClient(client);
        facture.setEntreprise(entreprise);
        calculateTotalPrice(facture);
        calculatePriceHt(facture);
        calculateTax(facture);
        calculateNetAmount(facture);
        Notification notification = new Notification();
        notification.setTitle("Nouvelle facture");
        notification.setMessage("Une nouvelle facture a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
        return factureRepo.save(facture);
    }

    public Facture convertCommandeToFacture(Integer commandeId, String empEmail) {
        Commande commande = commandeRepo.findById(commandeId)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable avec l'ID : " + commandeId));

        // Créer une nouvelle facture à partir de la commande
        Facture facture = new Facture();
        facture.setNumFacture("FAC-" + commande.getNumCommande()); // Générer un numéro de facture

        // Convertir et ajouter les produits
        List<Facture.ProductItem> factureProducts = commande.getProduits().stream()
                .map(this::convertToFactureProductItem)
                .collect(Collectors.toList());
        facture.setProduits(factureProducts);

        // Remplir d'autres champs
        facture.setPriceHt(commande.getPriceHt());
        facture.setTva(commande.getTva());
        facture.setTaxe(commande.getTaxe());
        facture.setNetApayer(commande.getNetApayer());
        facture.setEntreprise(commande.getEntreprise());
        facture.setClient(commande.getClient());
        facture.setCreatedAt(LocalDateTime.now());
        facture.setUpdatedAt(LocalDateTime.now());
        facture.setPaye(false); // Par défaut, la facture n'est pas payée
        Notification notification = new Notification();
        notification.setTitle("Nouvelle facture");
        notification.setMessage("Une nouvelle facture a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(commande.getEntreprise());
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);

        // Enregistrer la facture dans la base de données
        return factureRepo.save(facture);
    }

    private Facture.ProductItem convertToFactureProductItem(Commande.ProductItem commandeProductItem) {
        Facture.ProductItem factureProductItem = new Facture.ProductItem();
        factureProductItem.setNom(commandeProductItem.getNom());
        factureProductItem.setQuantite(commandeProductItem.getQuantite());
        factureProductItem.setPrixUnitaire(commandeProductItem.getPrixUnitaire());
        factureProductItem.setPrix_total(commandeProductItem.getPrix_total());
        return factureProductItem;
    }

    public Facture convertLivraisonToFacture(Integer livraisonId, String empEmail) {
        Livraison livraison = livraisonRepo.findById(livraisonId)
                .orElseThrow(() -> new IllegalArgumentException("Livraison introuvable avec l'ID : " + livraisonId));

        // Créer une nouvelle facture à partir de la livraison
        Facture facture = new Facture();
        facture.setNumFacture("FAC-" + livraison.getNumLivraison()); // Générer un numéro de facture

        // Convertir et ajouter les produits
        List<Facture.ProductItem> factureProducts = livraison.getProduits().stream()
                .map(this::convertToFactureProductItem)
                .collect(Collectors.toList());
        facture.setProduits(factureProducts);

        // Remplir d'autres champs
        facture.setPriceHt(livraison.getPriceHt());
        facture.setTva(livraison.getTva());
        facture.setTaxe(livraison.getTaxe());
        facture.setNetApayer(livraison.getNetApayer());
        facture.setEntreprise(livraison.getEntreprise());
        facture.setClient(livraison.getClient());
        facture.setCreatedAt(LocalDateTime.now());
        facture.setUpdatedAt(LocalDateTime.now());
        facture.setPaye(false); // Par défaut, la facture n'est pas payée
        Notification notification = new Notification();
        notification.setTitle("Nouvelle facture");
        notification.setMessage("Une nouvelle facture a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(livraison.getEntreprise());
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);

        // Enregistrer la facture dans la base de données
        return factureRepo.save(facture);
    }

    private Facture.ProductItem convertToFactureProductItem(Livraison.ProductItem livraisonProductItem) {
        Facture.ProductItem factureProductItem = new Facture.ProductItem();
        factureProductItem.setNom(livraisonProductItem.getNom());
        factureProductItem.setQuantite(livraisonProductItem.getQuantite());
        factureProductItem.setPrixUnitaire(livraisonProductItem.getPrixUnitaire());
        factureProductItem.setPrix_total(livraisonProductItem.getPrix_total());
        return factureProductItem;
    }

    public Facture findOne(Integer id) {
        return factureRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable avec l'ID : " + id));
    }

    public Facture update(Integer id, Facture updatedFacture,String empEmail) {
        Optional<Facture> existingFacture = factureRepo.findById(id);
        if (existingFacture.isPresent()) {
            Facture facture = existingFacture.get();
            facture.setNumFacture(updatedFacture.getNumFacture());
            facture.setProduits(updatedFacture.getProduits());
            facture.setTva(updatedFacture.getTva());
            calculateTotalPrice(facture);
            calculatePriceHt(facture);
            calculateTax(facture);
            calculateNetAmount(facture);
            return factureRepo.save(facture);
        } else {
            throw new IllegalArgumentException("Facture non trouvé avec l'ID : " + id);
        }
    }

    public void remove(Integer id) {
        factureRepo.deleteById(id);
    }

    public List<Facture> findByEntrepriseId(Integer entrepriseId) {
        return factureRepo.findByEntrepriseId(entrepriseId);
    }

    public Facture updateFactureStatus(Integer factureId) {
        Facture facture = factureRepo.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("facture introuvable avec l'ID : " + factureId));

        facture.setPaye(true);
        facture.setDatePaiement(LocalDateTime.now());
        return factureRepo.save(facture);
    }

    private void calculateTotalPrice(Facture facture) {
        facture.getProduits().forEach(product -> {
            product.setPrix_total(product.getQuantite() * product.getPrixUnitaire());
        });
    }

    private void calculatePriceHt(Facture facture) {
        facture.setPriceHt(facture.getProduits().stream()
                .mapToDouble(Facture.ProductItem::getPrix_total)
                .sum());
    }

    private void calculateTax(Facture facture) {
        if (facture.getPriceHt() != null && facture.getTva() != null) {
            facture.setTaxe((facture.getPriceHt() * facture.getTva()) / 100);
        } else {
            System.err.println("Impossible de calculer la taxe. Assurez-vous que priceHt et tva sont définis.");
        }
    }

    private void calculateNetAmount(Facture facture) {
        if (facture.getPriceHt() != null && facture.getTaxe() != null) {
            facture.setNetApayer(facture.getPriceHt() + facture.getTaxe());
        } else {
            System.err.println("Impossible de calculer le montant net. Assurez-vous que priceHt et taxe sont définis.");
        }
    }
}
