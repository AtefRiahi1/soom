package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.ModuleEmploye;
import tn.soom.backend.repositories.ModuleEmployeRepo;

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
}
