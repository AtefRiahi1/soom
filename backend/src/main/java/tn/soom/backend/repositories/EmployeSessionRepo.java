package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.EmployeSession;

import java.util.List;

public interface EmployeSessionRepo extends JpaRepository<EmployeSession, Integer> {
    List<EmployeSession> findByEmployeEntrepriseId(Integer identreprise);
}
