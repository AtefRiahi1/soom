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

    public Sortie create(Sortie sortie, Integer entrepriseId, Integer clientId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Client client = clientRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable avec l'ID : " + clientId));
        sortie.setClient(client);
        sortie.setEntreprise(entreprise);
        calculateTotalPrice(sortie);
        calculatePriceHt(sortie);
        calculateTax(sortie);
        calculateNetAmount(sortie);
        Notification notification = new Notification();
        notification.setTitle("Nouvelle sortie");
        notification.setMessage("Une nouvellle sortie a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
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
