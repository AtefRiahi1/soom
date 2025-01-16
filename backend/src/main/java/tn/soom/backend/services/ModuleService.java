package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.Module;
import tn.soom.backend.repositories.ModuleRepo;

import java.util.List;
import java.util.Optional;

@Service
public class ModuleService {

    @Autowired
    private ModuleRepo moduleRepository;

    public Module addModule(Module module) {
        return moduleRepository.save(module);
    }

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Optional<Module> getModuleById(Integer id) {
        return moduleRepository.findById(id);
    }

    public Module updateModule(Integer id, Module updatedModule) {
        Optional<Module> existingModule = moduleRepository.findById(id);
        if (existingModule.isPresent()) {
            Module module = existingModule.get();
            module.setNom(updatedModule.getNom());
            module.setPrix(updatedModule.getPrix());
            module.setApp(updatedModule.getApp());
            module.setPath(updatedModule.getPath());
            return moduleRepository.save(module);
        } else {
            throw new IllegalArgumentException("Module non trouvé avec l'ID : " + id);
        }
    }

    public void deleteModule(Integer id) {
        if (moduleRepository.existsById(id)) {
            moduleRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Module non trouvé avec l'ID : " + id);
        }
    }
}
