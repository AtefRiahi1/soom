package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.EmployeSession;
import tn.soom.backend.entities.EntrepriseSession;

public interface EntrepriseSessionRepo extends JpaRepository<EntrepriseSession, Integer> {
}
