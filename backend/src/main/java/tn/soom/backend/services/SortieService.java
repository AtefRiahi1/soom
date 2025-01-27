package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.*;

import java.util.List;
import java.util.Optional;

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
