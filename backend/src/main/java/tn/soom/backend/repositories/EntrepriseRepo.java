package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;

import java.util.Optional;

public interface EntrepriseRepo extends JpaRepository<Entreprise, Integer> {
    Entreprise findByEmployesId(Integer empId);
    Optional<Entreprise> findByEmail(String email);
    boolean existsByEmail(String email);
}
