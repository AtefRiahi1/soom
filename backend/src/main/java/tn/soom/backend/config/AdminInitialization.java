package tn.soom.backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import tn.soom.backend.services.AdminService;

@Component
public class AdminInitialization {
    private static final Logger logger = LoggerFactory.getLogger(AdminInitialization.class);

    private final AdminService adminService;

    public AdminInitialization(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostConstruct
    public void init() {
        logger.info("Initializing AdminInitialization bean...");
        try {
            adminService.createDefaultAdminIfNotExists();
            adminService.createDefaultCRMIfNotExists();
            logger.info("Default admin created successfully.");
        } catch (Exception e) {
            logger.error("Error occurred during initialization: " + e.getMessage(), e);
        }
    }
}
