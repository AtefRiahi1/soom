package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Facture;

import java.util.List;

public interface FactureRepo extends JpaRepository<Facture, Integer> {
    List<Facture> findByEntrepriseId(Integer ident);
}
