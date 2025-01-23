package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.ArticleRepo;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.repositories.MouvementRepo;
import tn.soom.backend.repositories.NotificationRepo;

import java.util.List;

@Service
public class MouvementService {

    @Autowired
    private ArticleService articleService;
    @Autowired
    private MouvementRepo mouvementRepo;
    @Autowired
    private ArticleRepo articleRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private NotificationRepo notificationRepo;

    public Mouvement createMovement(Mouvement mouvement, Integer entrepriseId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));

        mouvement.setEntreprise(entreprise);
        String nomProduit = mouvement.getNomProduit();
        String type = mouvement.getType();

        // Vérifier si l'article existe
        Article article = articleRepo.findByNom(nomProduit);

        // Si l'article n'existe pas et que le mouvement est de type 'vente', lancer une erreur
        if (article == null && "vente".equals(type)) {
            throw new RuntimeException("Le produit n'existe pas dans le stock");
        }

        // Créer un nouvel article si l'article n'existe pas
        if (article == null) {
            article = new Article();
            article.setNom(nomProduit);
            article.setEntreprise(entreprise);
            article.setQuantite(0); // Initialiser à 0 si c'est un nouvel article
            articleService.addArticle(article, entrepriseId, empEmail);
        }

        // Vérifier si la quantité en stock est suffisante pour une vente
        if ("vente".equals(type) && article.getQuantite() < mouvement.getQuantite()) {
            throw new RuntimeException("La quantité en stock n'est pas suffisante pour cette vente");
        }

        // Mettre à jour la quantité de l'article en fonction du type de mouvement
        if ("achat".equals(type)) {
            article.setQuantite(article.getQuantite() + mouvement.getQuantite());
        } else if ("vente".equals(type)) {
            article.setQuantite(article.getQuantite() - mouvement.getQuantite());
        }

        // Enregistrer les modifications apportées à l'article
        articleRepo.save(article);

        // Créer une notification
        Notification notification = new Notification();
        notification.setTitle("Mouvement de stock");
        notification.setMessage("Un mouvement de type " + type + " a été effectué pour l'article " + nomProduit + " avec une quantité de " + mouvement.getQuantite() + ".");
        notification.setCreatedBy(empEmail);
        notification.setEntreprise(entreprise);
        notification.setRead(false);

        // Enregistrer la notification
        notificationRepo.save(notification);

        // Enregistrer le mouvement
        return mouvementRepo.save(mouvement);
    }

    public List<Mouvement> getMouvementByEntrepriseId(Integer entrepriseId) {
        return mouvementRepo.findByEntrepriseId(entrepriseId);
    }
}
