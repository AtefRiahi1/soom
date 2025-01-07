package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.AdminSession;
import tn.soom.backend.entities.EmployeSession;

public interface AdminSessionRepo extends JpaRepository<AdminSession, Integer> {
}
