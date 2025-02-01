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
public class CommandeService {
    @Autowired
    private CommandeRepo commandeRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private ClientRepo clientRepo;
    @Autowired
    private NotificationRepo notificationRepo;
    @Autowired
    private DevisRepo devisRepo;

    public Commande create(Commande commande, Integer entrepriseId, Integer clientId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));
        Client client = clientRepo.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable avec l'ID : " + clientId));
        commande.setClient(client);
        commande.setEntreprise(entreprise);
        calculateTotalPrice(commande);
        calculatePriceHt(commande);
        calculateTax(commande);
        calculateNetAmount(commande);
        Notification notification = new Notification();
        notification.setTitle("Nouvelle commande");
        notification.setMessage("Une nouvelle commande a été créée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);
        return commandeRepo.save(commande);
    }

    public Commande convertDevisToCommande(Integer devisId, String empEmail) {
        Devis devis = devisRepo.findById(devisId)
                .orElseThrow(() -> new IllegalArgumentException("Devis introuvable avec l'ID : " + devisId));

        // Créer une nouvelle commande à partir du devis
        Commande commande = new Commande();
        commande.setNumCommande("CMD-" + devis.getNumDevis()); // Générer un numéro de commande

        // Convertir et ajouter les produits
        List<Commande.ProductItem> commandeProducts = devis.getProduits().stream()
                .map(this::convertToCommandeProductItem)
                .collect(Collectors.toList());
        commande.setProduits(commandeProducts);

        // Remplir d'autres champs
        commande.setPriceHt(devis.getPriceHt());
        commande.setTva(devis.getTva());
        commande.setTaxe(devis.getTaxe());
        commande.setNetApayer(devis.getNetApayer());
        commande.setEntreprise(devis.getEntreprise());
        commande.setClient(devis.getClient());
        commande.setCreatedAt(LocalDateTime.now());
        commande.setUpdatedAt(LocalDateTime.now());

        Notification notification = new Notification();
        notification.setTitle("Nouvelle commande");
        notification.setMessage("Une nouvelle commande a été crée.");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(devis.getEntreprise());
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);

        // Enregistrer la commande dans la base de données
        return commandeRepo.save(commande);
    }

    private Commande.ProductItem convertToCommandeProductItem(Devis.ProductItem devisProductItem) {
        Commande.ProductItem commandeProductItem = new Commande.ProductItem();
        commandeProductItem.setNom(devisProductItem.getNom());
        commandeProductItem.setQuantite(devisProductItem.getQuantite());
        commandeProductItem.setPrixUnitaire(devisProductItem.getPrixUnitaire());
        commandeProductItem.setPrix_total(devisProductItem.getPrix_total());
        return commandeProductItem;
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
