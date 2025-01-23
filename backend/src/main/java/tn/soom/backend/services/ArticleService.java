package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.Article;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.entities.Notification;
import tn.soom.backend.repositories.ArticleRepo;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.repositories.NotificationRepo;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private ArticleRepo artiecleRepo;
    @Autowired
    private NotificationRepo notificationRepository;

    public Article addArticle(Article article, Integer entrepriseId, String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));

        article.setEntreprise(entreprise);


        Article savedArticle = artiecleRepo.save(article);

        if (entreprise != null) {
            Notification notification = new Notification();
            notification.setTitle("Nouvel article ajouté");
            notification.setMessage("Un nouvel article, " + savedArticle.getNom() + ", a été ajouté à l'entreprise " + entreprise.getName() + ".");
            notification.setCreatedBy(empEmail);
            notification.setEntreprise(entreprise);
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        return savedArticle;
    }

    public List<Article> getArticleByEntrepriseId(Integer entrepriseId) {
        return artiecleRepo.findByEntrepriseId(entrepriseId);
    }

    public Article updateArticle(Integer id, Article updatedArticle) {
        Optional<Article> existingArticle = artiecleRepo.findById(id);
        if (existingArticle.isPresent()) {
            Article article = existingArticle.get();
            article.setNom(updatedArticle.getNom());
            article.setQuantite(updatedArticle.getQuantite());
            return artiecleRepo.save(article);
        } else {
            throw new IllegalArgumentException("Article non trouvé avec l'ID : " + id);
        }
    }

    public void deleteArticle(Integer id) {
        if (artiecleRepo.existsById(id)) {
            artiecleRepo.deleteById(id);
        } else {
            throw new IllegalArgumentException("Article non trouvé avec l'ID : " + id);
        }
    }
}
