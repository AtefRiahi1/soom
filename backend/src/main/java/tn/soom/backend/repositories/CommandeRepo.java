package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Commande;

import java.util.List;

public interface CommandeRepo extends JpaRepository<Commande, Integer> {
    List<Commande> findByEntrepriseId(Integer ident);
}
