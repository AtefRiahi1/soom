package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.ModuleEmploye;

import java.util.List;

public interface ModuleEmployeRepo extends JpaRepository<ModuleEmploye, Integer> {
    List<ModuleEmploye> findByEmployeId(Integer empId);
}
