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
public class SortieService {
    @Autowired
    private SortieRepo sortieRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private NotificationRepo notificationRepo;
    @Autowired
    private MouvementService mouvementService;
    @Autowired
    private FactureRepo factureRepo;

    public Sortie create(Sortie sortie, Integer entrepriseId, Integer clientId, String empEmail) {
        // Récupération de l'entreprise
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));

        // Récupération du client
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable avec l'ID : " + clientId));

        // Affectation de l'entreprise et du client à la sortie
        sortie.setClient(client);
        sortie.setEntreprise(entreprise);

        // Calculs associés à la sortie
        calculateTotalPrice(sortie);
        calculatePriceHt(sortie);
        calculateTax(sortie);
        calculateNetAmount(sortie);

        // Création d'un mouvement de type "vente" pour chaque produit inclus dans la sortie
        if (sortie.getProduits() != null) {
            sortie.getProduits().forEach(produit -> {
                Mouvement mouvement = new Mouvement();
                mouvement.setNomProduit(produit.getNom());
                mouvement.setQuantite(produit.getQuantite());
                mouvement.setType("VENTE"); // Mouvement de type "vente"
                mouvement.setEntreprise(entreprise);

                // Utiliser directement la méthode createMovement du service Mouvement
                mouvementService.createMovement(mouvement, entrepriseId, empEmail);
            });
        }

        // Création et enregistrement d'une notification
        Notification notification = new Notification();
        notification.setTitle("Nouvelle sortie");
        notification.setMessage("Une nouvelle sortie a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        notificationRepo.save(notification);

        // Sauvegarde de la sortie
        return sortieRepo.save(sortie);
    }

    public Sortie convertFactureToSortie(Integer factureId, String empEmail) {
        Facture facture = factureRepo.findById(factureId)
                .orElseThrow(() -> new IllegalArgumentException("Facture introuvable avec l'ID : " + factureId));

        // Créer une nouvelle sortie à partir de la facture
        Sortie sortie = new Sortie();
        sortie.setNumSortie("SORT-" + facture.getNumFacture()); // Générer un numéro de sortie

        // Convertir et ajouter les produits
        List<Sortie.ProductItem> sortieProducts = facture.getProduits().stream()
                .map(this::convertToSortieProductItem)
                .collect(Collectors.toList());
        sortie.setProduits(sortieProducts);

        // Remplir d'autres champs
        sortie.setPriceHt(facture.getPriceHt());
        sortie.setNomFichier("SORT-" + facture.getNumFacture() + ".pdf");
        sortie.setTva(facture.getTva());
        sortie.setTaxe(facture.getTaxe());
        sortie.setNetApayer(facture.getNetApayer());
        sortie.setEntreprise(facture.getEntreprise());
        sortie.setClient(facture.getClient());
        sortie.setCreatedAt(LocalDateTime.now());
        sortie.setUpdatedAt(LocalDateTime.now());
        if (facture.getProduits() != null) {
            sortie.getProduits().forEach(produit -> {
                Mouvement mouvement = new Mouvement();
                mouvement.setNomProduit(produit.getNom());
                mouvement.setQuantite(produit.getQuantite());
                mouvement.setType("VENTE"); // Mouvement de type "vente"
                mouvement.setEntreprise(facture.getEntreprise());

                // Utiliser directement la méthode createMovement du service Mouvement
                mouvementService.createMovement(mouvement, facture.getEntreprise().getId(), empEmail);
            });
        }
        Notification notification = new Notification();
        notification.setTitle("Nouvelle sortie");
        notification.setMessage("Une nouvelle sortie a été crée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(facture.getEntreprise());
        notification.setRead(false);

        notificationRepo.save(notification);

        // Enregistrer la sortie dans la base de données
        return sortieRepo.save(sortie);
    }

    private Sortie.ProductItem convertToSortieProductItem(Facture.ProductItem factureProductItem) {
        Sortie.ProductItem sortieProductItem = new Sortie.ProductItem();
        sortieProductItem.setNom(factureProductItem.getNom());
        sortieProductItem.setQuantite(factureProductItem.getQuantite());
        sortieProductItem.setPrixUnitaire(factureProductItem.getPrixUnitaire());
        sortieProductItem.setPrix_total(factureProductItem.getPrix_total());
        return sortieProductItem;
    }


    public Sortie findOne(Integer id) {
        return sortieRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Sortie introuvable avec l'ID : " + id));
    }

    public Sortie update(Integer id, Sortie updatedSortie,String empEmail) {
        Optional<Sortie> existingSortie = sortieRepo.findById(id);
        if (existingSortie.isPresent()) {
            Sortie sortie = existingSortie.get();
            sortie.setNumSortie(updatedSortie.getNumSortie());
            sortie.setProduits(updatedSortie.getProduits());
            sortie.setTva(updatedSortie.getTva());
            sortie.setNomFichier(updatedSortie.getNomFichier());
            calculateTotalPrice(sortie);
            calculatePriceHt(sortie);
            calculateTax(sortie);
            calculateNetAmount(sortie);
            return sortieRepo.save(sortie);
        } else {
            throw new IllegalArgumentException("Sortie non trouvé avec l'ID : " + id);
        }
    }

    public void remove(Integer id) {
        sortieRepo.deleteById(id);
    }

    public List<Sortie> findByEntrepriseId(Integer entrepriseId) {
        return sortieRepo.findByEntrepriseId(entrepriseId);
    }

    private void calculateTotalPrice(Sortie sortie) {
        sortie.getProduits().forEach(product -> {
            product.setPrix_total(product.getQuantite() * product.getPrixUnitaire());
        });
    }

    private void calculatePriceHt(Sortie sortie) {
        sortie.setPriceHt(sortie.getProduits().stream()
                .mapToDouble(Sortie.ProductItem::getPrix_total)
                .sum());
    }

    private void calculateTax(Sortie sortie) {
        if (sortie.getPriceHt() != null && sortie.getTva() != null) {
            sortie.setTaxe((sortie.getPriceHt() * sortie.getTva()) / 100);
        } else {
            System.err.println("Impossible de calculer la taxe. Assurez-vous que priceHt et tva sont définis.");
        }
    }

    private void calculateNetAmount(Sortie sortie) {
        if (sortie.getPriceHt() != null && sortie.getTaxe() != null) {
            sortie.setNetApayer(sortie.getPriceHt() + sortie.getTaxe());
        } else {
            System.err.println("Impossible de calculer le montant net. Assurez-vous que priceHt et taxe sont définis.");
        }
    }
}
