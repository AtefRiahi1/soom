package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Article;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Fournisseur;

import java.util.List;

public interface ArtiecleRepo extends JpaRepository<Article, Integer> {
    List<Article> findByEntrepriseId(Integer ident);
}
