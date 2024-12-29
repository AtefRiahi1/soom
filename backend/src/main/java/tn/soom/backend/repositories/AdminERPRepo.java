package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.AdminERP;

import java.util.Optional;

public interface AdminERPRepo extends JpaRepository<AdminERP, Integer> {
    Optional<AdminERP> findByEmail(String email);
    AdminERP findByRole(String role);
}
