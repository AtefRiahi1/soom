package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    public Facture create(Facture facture, Integer entrepriseId, Integer clientId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Client client = clientRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable avec l'ID : " + clientId));
        facture.setClient(client);
        facture.setEntreprise(entreprise);
        calculateTotalPrice(facture);
        calculatePriceHt(facture);
        calculateTax(facture);
        calculateNetAmount(facture);
        Notification notification = new Notification();
        notification.setTitle("Nouvelle facture d'achat");
        notification.setMessage("Une nouvelle facture a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
        return factureRepo.save(facture);
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
