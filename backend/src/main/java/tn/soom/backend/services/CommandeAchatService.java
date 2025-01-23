package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.entities.Module;
import tn.soom.backend.repositories.CommandeAchatRepo;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.repositories.FournisseurRepo;
import tn.soom.backend.repositories.NotificationRepo;

import java.util.List;
import java.util.Optional;

@Service
public class CommandeAchatService {
    @Autowired
    private CommandeAchatRepo commandeAchatRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private FournisseurRepo fournisseurRepo;
    @Autowired
    private NotificationRepo notificationRepo;

    public CommandeAchat create(CommandeAchat commandeAchat, Integer entrepriseId, Integer fournisseurId,String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Fournisseur fournisseur = fournisseurRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Fournisseur introuvable avec l'ID : " + fournisseurId));
        commandeAchat.setFournisseur(fournisseur);
        commandeAchat.setEntreprise(entreprise);
        calculateTotalPrice(commandeAchat);
        calculatePriceHt(commandeAchat);
        calculateTax(commandeAchat);
        calculateNetAmount(commandeAchat);
        Notification notification = new Notification();
        notification.setTitle("Nouvelle commande d'achat");
        notification.setMessage("Une nouvelle commande d'achat a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
        return commandeAchatRepo.save(commandeAchat);
    }

    public CommandeAchat findOne(Integer id) {
        return commandeAchatRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande d'achat introuvable avec l'ID : " + id));
    }

    public CommandeAchat update(Integer id, CommandeAchat updatedCommandeAchat,String empEmail) {
        Optional<CommandeAchat> existingCommandeAchat = commandeAchatRepo.findById(id);
        if (existingCommandeAchat.isPresent()) {
            CommandeAchat commandeAchat = existingCommandeAchat.get();
            commandeAchat.setNumCommande(updatedCommandeAchat.getNumCommande());
            commandeAchat.setProduits(updatedCommandeAchat.getProduits());
            commandeAchat.setTva(updatedCommandeAchat.getTva());
            calculateTotalPrice(commandeAchat);
            calculatePriceHt(commandeAchat);
            calculateTax(commandeAchat);
            calculateNetAmount(commandeAchat);
            return commandeAchatRepo.save(commandeAchat);
        } else {
            throw new IllegalArgumentException("Commande non trouvé avec l'ID : " + id);
        }
    }

    public void remove(Integer id) {
        commandeAchatRepo.deleteById(id);
    }

    public List<CommandeAchat> findByEntrepriseId(Integer entrepriseId) {
        return commandeAchatRepo.findByEntrepriseId(entrepriseId);
    }

    private void calculateTotalPrice(CommandeAchat commandeAchat) {
        commandeAchat.getProduits().forEach(product -> {
            product.setPrix_total(product.getQuantite() * product.getPrixUnitaire());
        });
    }

    private void calculatePriceHt(CommandeAchat commandeAchat) {
        commandeAchat.setPriceHt(commandeAchat.getProduits().stream()
                .mapToDouble(CommandeAchat.ProductItem::getPrix_total)
                .sum());
    }

    private void calculateTax(CommandeAchat commandeAchat) {
        if (commandeAchat.getPriceHt() != null && commandeAchat.getTva() != null) {
            commandeAchat.setTaxe((commandeAchat.getPriceHt() * commandeAchat.getTva()) / 100);
        } else {
            System.err.println("Impossible de calculer la taxe. Assurez-vous que priceHt et tva sont définis.");
        }
    }

    private void calculateNetAmount(CommandeAchat commandeAchat) {
        if (commandeAchat.getPriceHt() != null && commandeAchat.getTaxe() != null) {
            commandeAchat.setNetApayer(commandeAchat.getPriceHt() + commandeAchat.getTaxe());
        } else {
            System.err.println("Impossible de calculer le montant net. Assurez-vous que priceHt et taxe sont définis.");
        }
    }
}
