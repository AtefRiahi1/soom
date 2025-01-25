package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Sortie;

import java.util.List;

public interface SortieRepo extends JpaRepository<Sortie, Integer> {
    List<Sortie> findByEntrepriseId(Integer ident);
}
