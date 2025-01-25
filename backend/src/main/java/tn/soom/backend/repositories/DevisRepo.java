package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Devis;

import java.util.List;

public interface DevisRepo extends JpaRepository<Devis, Integer> {
    List<Devis> findByEntrepriseId(Integer ident);
}
