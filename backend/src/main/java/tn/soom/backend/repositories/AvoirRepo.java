package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Article;
import tn.soom.backend.entities.Avoir;

import java.util.List;

public interface AvoirRepo extends JpaRepository<Avoir, Integer> {
    List<Avoir> findByEntrepriseId(Integer ident);
}
