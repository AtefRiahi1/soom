package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.AdminSession;
import tn.soom.backend.entities.EmployeSession;
import tn.soom.backend.repositories.AdminSessionRepo;
import tn.soom.backend.repositories.EmployeSessionRepo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminSessionService {
    @Autowired
    private AdminSessionRepo adminSessionRepo;

    public AdminSession createSession(String adminMail) {
        AdminSession session = new AdminSession();
        session.setAdminemail(adminMail);
        session.setSessionStart(LocalDateTime.now());
        return adminSessionRepo.save(session);
    }

    public void endSession(Integer sessionId) {
        AdminSession session = adminSessionRepo.findById(sessionId).orElseThrow();
        session.setSessionEnd(LocalDateTime.now());
        adminSessionRepo.save(session);
    }

    public AdminSession createAdminSession(AdminSession adminSession) {
        return adminSessionRepo.save(adminSession);
    }

    public boolean isSessionActive(Integer sessionId) {
        Optional<AdminSession> optionalAdminSession = adminSessionRepo.findById(sessionId);

        if (optionalAdminSession.isPresent()) {
            AdminSession adminSession = optionalAdminSession.get();
            return adminSession.getSessionEnd() == null;
        }

        return false;
    }
}
