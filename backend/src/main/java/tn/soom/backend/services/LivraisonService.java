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
public class LivraisonService {
    @Autowired
    private LivraisonRepo livraisonRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private NotificationRepo notificationRepo;
    @Autowired
    private CommandeRepo commandeRepo;

    public Livraison create(Livraison livraison, Integer entrepriseId, Integer clientId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable avec l'ID : " + clientId));
        livraison.setClient(client);
        livraison.setEntreprise(entreprise);
        calculateTotalPrice(livraison);
        calculatePriceHt(livraison);
        calculateTax(livraison);
        calculateNetAmount(livraison);
        Notification notification = new Notification();
        notification.setTitle("Nouvelle livraison");
        notification.setMessage("Une nouvelle livraison a été crée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
        return livraisonRepo.save(livraison);
    }

    public Livraison convertCommandeToLivraison(Integer commandeId, String empEmail) {
        Commande commande = commandeRepo.findById(commandeId)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable avec l'ID : " + commandeId));

        // Créer une nouvelle livraison à partir de la commande
        Livraison livraison = new Livraison();
        livraison.setNumLivraison("LIV-" + commande.getNumCommande()); // Générer un numéro de livraison

        // Convertir et ajouter les produits
        List<Livraison.ProductItem> livraisonProducts = commande.getProduits().stream()
                .map(this::convertToLivraisonProductItem)
                .collect(Collectors.toList());
        livraison.setProduits(livraisonProducts);

        // Remplir d'autres champs
        livraison.setPriceHt(commande.getPriceHt());
        livraison.setNomFichier("LIV-" + commande.getNumCommande() + ".pdf");
        livraison.setTva(commande.getTva());
        livraison.setTaxe(commande.getTaxe());
        livraison.setNetApayer(commande.getNetApayer());
        livraison.setEntreprise(commande.getEntreprise());
        livraison.setClient(commande.getClient());
        livraison.setCreatedAt(LocalDateTime.now());
        livraison.setUpdatedAt(LocalDateTime.now());
        Notification notification = new Notification();
        notification.setTitle("Nouvelle livraison");
        notification.setMessage("Une nouvelle livraison a été crée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(commande.getEntreprise());
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);

        // Enregistrer la livraison dans la base de données
        return livraisonRepo.save(livraison);
    }

    private Livraison.ProductItem convertToLivraisonProductItem(Commande.ProductItem commandeProductItem) {
        Livraison.ProductItem livraisonProductItem = new Livraison.ProductItem();
        livraisonProductItem.setNom(commandeProductItem.getNom());
        livraisonProductItem.setQuantite(commandeProductItem.getQuantite());
        livraisonProductItem.setPrixUnitaire(commandeProductItem.getPrixUnitaire());
        livraisonProductItem.setPrix_total(commandeProductItem.getPrix_total());
        return livraisonProductItem;
    }

    public Livraison findOne(Integer id) {
        return livraisonRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison introuvable avec l'ID : " + id));
    }

    public Livraison update(Integer id, Livraison updatedLivraison,String empEmail) {
        Optional<Livraison> existingLivraison = livraisonRepo.findById(id);
        if (existingLivraison.isPresent()) {
            Livraison livraison = existingLivraison.get();
            livraison.setNumLivraison(updatedLivraison.getNumLivraison());
            livraison.setProduits(updatedLivraison.getProduits());
            livraison.setTva(updatedLivraison.getTva());
            calculateTotalPrice(livraison);
            calculatePriceHt(livraison);
            calculateTax(livraison);
            calculateNetAmount(livraison);
            return livraisonRepo.save(livraison);
        } else {
            throw new IllegalArgumentException("Livraison non trouvé avec l'ID : " + id);
        }
    }

    public void remove(Integer id) {
        livraisonRepo.deleteById(id);
    }

    public List<Livraison> findByEntrepriseId(Integer entrepriseId) {
        return livraisonRepo.findByEntrepriseId(entrepriseId);
    }

    private void calculateTotalPrice(Livraison livraison) {
        livraison.getProduits().forEach(product -> {
            product.setPrix_total(product.getQuantite() * product.getPrixUnitaire());
        });
    }

    private void calculatePriceHt(Livraison livraison) {
        livraison.setPriceHt(livraison.getProduits().stream()
                .mapToDouble(Livraison.ProductItem::getPrix_total)
                .sum());
    }

    private void calculateTax(Livraison livraison) {
        if (livraison.getPriceHt() != null && livraison.getTva() != null) {
            livraison.setTaxe((livraison.getPriceHt() * livraison.getTva()) / 100);
        } else {
            System.err.println("Impossible de calculer la taxe. Assurez-vous que priceHt et tva sont définis.");
        }
    }

    private void calculateNetAmount(Livraison livraison) {
        if (livraison.getPriceHt() != null && livraison.getTaxe() != null) {
            livraison.setNetApayer(livraison.getPriceHt() + livraison.getTaxe());
        } else {
            System.err.println("Impossible de calculer le montant net. Assurez-vous que priceHt et taxe sont définis.");
        }
    }
}
