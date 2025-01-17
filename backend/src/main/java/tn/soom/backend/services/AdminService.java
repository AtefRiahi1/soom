package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.Module;
import tn.soom.backend.repositories.AdminERPRepo;
import tn.soom.backend.repositories.ModuleRepo;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AdminERPRepo adminERPRepo;
    @Autowired
    private ModuleRepo moduleRepo;

    @Transactional
    public void createDefaultAdminIfNotExists() {
        AdminERP adminERP = adminERPRepo.findByRole("ADMIN");

        if (adminERP == null) {
            AdminERP defaultAdmin = new AdminERP();
            defaultAdmin.setEmail("admin@gmail.com");
            defaultAdmin.setPassword(passwordEncoder.encode("admin"));
            defaultAdmin.setRole("ADMIN");
            defaultAdmin.setCreatedAt(LocalDateTime.now());
            defaultAdmin.setUpdatedAt(LocalDateTime.now());

            adminERPRepo.save(defaultAdmin);
        }
    }

    @Transactional
    public void createDefaultCRMIfNotExists() {
        Module module = moduleRepo.findByNom("CRM");

        if (module == null) {
            Module defaultModule = new Module();
            defaultModule.setNom("CRM");
            defaultModule.setApp(true);
            defaultModule.setPath("/employes");
            defaultModule.setPrix(0.0);
            defaultModule.setId(1);

            moduleRepo.save(defaultModule);
        }
    }

    public Optional<AdminERP> getAdminByEmail(String email) {
        return adminERPRepo.findByEmail(email);
    }
}
