package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.ModuleEmploye;
import tn.soom.backend.repositories.ModuleEmployeRepo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ModuleEmployeService {
    @Autowired
    private ModuleEmployeRepo moduleEmployeRepository;

    public List<ModuleEmploye> getModuleEmployeByEmployeId(Integer empId) {
        return moduleEmployeRepository.findByEmployeId(empId);
    }

    public Optional<ModuleEmploye> updateModuleEmployePermissions(Integer id, boolean consulter, boolean modifier, boolean ajouter, boolean supprimer) {
        Optional<ModuleEmploye> moduleEmployeOptional = moduleEmployeRepository.findById(id);

        if (moduleEmployeOptional.isPresent()) {
            ModuleEmploye moduleEmploye = moduleEmployeOptional.get();
            moduleEmploye.setConsulter(consulter);
            moduleEmploye.setModifier(modifier);
            moduleEmploye.setAjouter(ajouter);
            moduleEmploye.setSupprimer(supprimer);
            return Optional.of(moduleEmployeRepository.save(moduleEmploye));
        } else {
            return Optional.empty();
        }
    }

    public ModuleEmploye updateModuleEmployePaye(Integer moduleemployeId) {
        ModuleEmploye moduleEmploye = moduleEmployeRepository.findById(moduleemployeId)
                .orElseThrow(() -> new IllegalArgumentException("Module introuvable avec l'ID : " + moduleemployeId));

        moduleEmploye.setPaye(true);
        moduleEmploye.setPaymentDate(LocalDateTime.now());
        return moduleEmployeRepository.save(moduleEmploye);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void resetModuleEmployePaymentStatus() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);

        List<ModuleEmploye> modulesToUpdate = moduleEmployeRepository.findAllByPaymentDateBefore(oneMonthAgo);

        for (ModuleEmploye moduleEmploye : modulesToUpdate) {
            moduleEmploye.setPaye(false);
            moduleEmploye.setPaymentDate(null);
        }

        moduleEmployeRepository.saveAll(modulesToUpdate);

        System.out.println("Mise à jour des modules employé effectuée : " + modulesToUpdate.size() + " modules mis à jour.");
    }
}
