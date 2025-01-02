package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.ModuleEmploye;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ModuleEmployeRepo extends JpaRepository<ModuleEmploye, Integer> {
    List<ModuleEmploye> findByEmployeId(Integer empId);
    Optional<ModuleEmploye> findByEmployeIdAndModuleId(Integer employeId, Integer moduleId);
    List<ModuleEmploye> findAllByPaymentDateBefore(LocalDateTime date);
}
