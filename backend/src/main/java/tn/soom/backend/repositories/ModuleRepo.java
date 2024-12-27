package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.Module;

public interface ModuleRepo extends JpaRepository<Module, Integer> {
}
