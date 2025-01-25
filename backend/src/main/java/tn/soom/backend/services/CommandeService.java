package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.*;

import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepo commandeRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private NotificationRepo notificationRepo;

    public Commande create(Commande commande, Integer entrepriseId, Integer clientId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Client client = clientRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable avec l'ID : " + clientId));
        commande.setClient(client);
        commande.setEntreprise(entreprise);
        calculateTotalPrice(commande);
        calculatePriceHt(commande);
        calculateTax(commande);
        calculateNetAmount(commande);
        Notification notification = new Notification();
        notification.setTitle("Nouvelle commande");
        notification.setMessage("Une nouvellle commande a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
        return commandeRepo.save(commande);
    }

    public Commande findOne(Integer id) {
        return commandeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec l'ID : " + id));
    }

    public Commande update(Integer id, Commande updatedCommande,String empEmail) {
        Optional<Commande> existingCommande = commandeRepo.findById(id);
        if (existingCommande.isPresent()) {
            Commande commande = existingCommande.get();
            commande.setNumCommande(updatedCommande.getNumCommande());
            commande.setProduits(updatedCommande.getProduits());
            commande.setTva(updatedCommande.getTva());
            calculateTotalPrice(commande);
            calculatePriceHt(commande);
            calculateTax(commande);
            calculateNetAmount(commande);
            return commandeRepo.save(commande);
        } else {
            throw new IllegalArgumentException("Commande non trouvé avec l'ID : " + id);
        }
    }

    public void remove(Integer id) {
        commandeRepo.deleteById(id);
    }

    public List<Commande> findByEntrepriseId(Integer entrepriseId) {
        return commandeRepo.findByEntrepriseId(entrepriseId);
    }

    private void calculateTotalPrice(Commande commande) {
        commande.getProduits().forEach(product -> {
            product.setPrix_total(product.getQuantite() * product.getPrixUnitaire());
        });
    }

    private void calculatePriceHt(Commande commande) {
        commande.setPriceHt(commande.getProduits().stream()
                .mapToDouble(Commande.ProductItem::getPrix_total)
                .sum());
    }

    private void calculateTax(Commande commande) {
        if (commande.getPriceHt() != null && commande.getTva() != null) {
            commande.setTaxe((commande.getPriceHt() * commande.getTva()) / 100);
        } else {
            System.err.println("Impossible de calculer la taxe. Assurez-vous que priceHt et tva sont définis.");
        }
    }

    private void calculateNetAmount(Commande commande) {
        if (commande.getPriceHt() != null && commande.getTaxe() != null) {
            commande.setNetApayer(commande.getPriceHt() + commande.getTaxe());
        } else {
            System.err.println("Impossible de calculer le montant net. Assurez-vous que priceHt et taxe sont définis.");
        }
    }
}
