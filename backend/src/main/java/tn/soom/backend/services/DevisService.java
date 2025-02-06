package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.*;

import java.util.List;
import java.util.Optional;

@Service
public class DevisService {
    @Autowired
    private DevisRepo devisRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private NotificationRepo notificationRepo;

    public Devis create(Devis devis, Integer entrepriseId, Integer clientId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable avec l'ID : " + clientId));
        devis.setClient(client);
        devis.setEntreprise(entreprise);
        calculateTotalPrice(devis);
        calculatePriceHt(devis);
        calculateTax(devis);
        calculateNetAmount(devis);
        Notification notification = new Notification();
        notification.setTitle("Nouvel devis");
        notification.setMessage("Un nouvel devis a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
        return devisRepo.save(devis);
    }

    public Devis findOne(Integer id) {
        return devisRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Devis introuvable avec l'ID : " + id));
    }

    public Devis update(Integer id, Devis updatedDevis,String empEmail) {
        Optional<Devis> existingDevis = devisRepo.findById(id);
        if (existingDevis.isPresent()) {
            Devis devis = existingDevis.get();
            devis.setNumDevis(updatedDevis.getNumDevis());
            devis.setProduits(updatedDevis.getProduits());
            devis.setTva(updatedDevis.getTva());
            devis.setNomFichier(updatedDevis.getNomFichier());
            calculateTotalPrice(devis);
            calculatePriceHt(devis);
            calculateTax(devis);
            calculateNetAmount(devis);
            return devisRepo.save(devis);
        } else {
            throw new IllegalArgumentException("Devis non trouvé avec l'ID : " + id);
        }
    }

    public void remove(Integer id) {
        devisRepo.deleteById(id);
    }

    public List<Devis> findByEntrepriseId(Integer entrepriseId) {
        return devisRepo.findByEntrepriseId(entrepriseId);
    }

    private void calculateTotalPrice(Devis devis) {
        devis.getProduits().forEach(product -> {
            product.setPrix_total(product.getQuantite() * product.getPrixUnitaire());
        });
    }

    private void calculatePriceHt(Devis devis) {
        devis.setPriceHt(devis.getProduits().stream()
                .mapToDouble(Devis.ProductItem::getPrix_total)
                .sum());
    }

    private void calculateTax(Devis devis) {
        if (devis.getPriceHt() != null && devis.getTva() != null) {
            devis.setTaxe((devis.getPriceHt() * devis.getTva()) / 100);
        } else {
            System.err.println("Impossible de calculer la taxe. Assurez-vous que priceHt et tva sont définis.");
        }
    }

    private void calculateNetAmount(Devis devis) {
        if (devis.getPriceHt() != null && devis.getTaxe() != null) {
            devis.setNetApayer(devis.getPriceHt() + devis.getTaxe());
        } else {
            System.err.println("Impossible de calculer le montant net. Assurez-vous que priceHt et taxe sont définis.");
        }
    }
}
