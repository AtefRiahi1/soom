package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.repositories.AdminERPRepo;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AdminERPRepo adminERPRepo;

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

    public Optional<AdminERP> getAdminByEmail(String email) {
        return adminERPRepo.findByEmail(email);
    }
}
