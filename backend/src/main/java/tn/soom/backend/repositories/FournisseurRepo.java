package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Fournisseur;

import java.util.List;

public interface FournisseurRepo extends JpaRepository<Fournisseur, Integer> {
    List<Fournisseur> findByEntrepriseId(Integer ident);
}
