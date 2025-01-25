package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Livraison;

import java.util.List;

public interface LivraisonRepo extends JpaRepository<Livraison, Integer> {
    List<Livraison> findByEntrepriseId(Integer ident);
}
