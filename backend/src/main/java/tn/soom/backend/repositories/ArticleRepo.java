package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Article;

import java.util.List;

public interface ArticleRepo extends JpaRepository<Article, Integer> {
    List<Article> findByEntrepriseId(Integer ident);
    Article findByNom(String nom);
}
