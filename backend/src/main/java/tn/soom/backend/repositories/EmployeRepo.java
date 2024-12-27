package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Employe;

import java.util.List;
import java.util.Optional;

public interface EmployeRepo extends JpaRepository<Employe, Integer> {
    Optional<Employe> findByEmail(String email);
    List<Employe> findByEntrepriseId(Integer ident);
}
