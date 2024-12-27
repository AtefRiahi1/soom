package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.ModuleEmploye;

public interface ModuleEmployeRepo extends JpaRepository<ModuleEmploye, Integer> {
}
