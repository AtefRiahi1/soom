package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.AdminSession;
import tn.soom.backend.entities.EmployeSession;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.services.AdminService;
import tn.soom.backend.services.AdminSessionService;
import tn.soom.backend.services.EmployeSessionService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/adminsessions")
public class AdminSessionController {
    @Autowired
    private AdminSessionService adminSessionService;
    @Autowired
    private AdminService adminService;
    @PostMapping("/start")
    public AdminSession startSession(@RequestParam String adminMail) {
        return adminSessionService.createSession(adminMail);
    }

    @PostMapping("/end")
    public void endSession(@RequestParam Integer sessionId) {
        adminSessionService.endSession(sessionId);
    }

    @PostMapping
    public ResponseEntity<AdminSession> createAdminSession(@RequestBody AdminSession adminSession) {
        AdminSession createdAdminSession = adminSessionService.createAdminSession(adminSession);
        return new ResponseEntity<>(createdAdminSession, HttpStatus.CREATED);
    }
    @GetMapping("/{id}/active")
    public ResponseEntity<Boolean> isSessionActive(@PathVariable Integer id) {
        boolean isActive = adminSessionService.isSessionActive(id);
        return new ResponseEntity<>(isActive, HttpStatus.OK);
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getAdminByEmail(@PathVariable String email) {
        Optional<AdminERP> adminERPOptional = adminService.getAdminByEmail(email);

        if (adminERPOptional.isPresent()) {
            return ResponseEntity.ok(adminERPOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Admin non trouvée pour l'email : " + email);
        }
    }
}
