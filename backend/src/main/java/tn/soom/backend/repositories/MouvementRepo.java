package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Fournisseur;
import tn.soom.backend.entities.Mouvement;

import java.util.List;

public interface MouvementRepo extends JpaRepository<Mouvement, Integer> {
    List<Mouvement> findByEntrepriseId(Integer ident);
}
