package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.EmployeSession;
import tn.soom.backend.repositories.EmployeSessionRepo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeSessionService {
    @Autowired
    private EmployeSessionRepo employeSessionRepo;

    public EmployeSession createSession(String empMail) {
        EmployeSession session = new EmployeSession();
        session.setEmployeemail(empMail);
        session.setSessionStart(LocalDateTime.now());
        return employeSessionRepo.save(session);
    }

    public void endSession(Integer sessionId) {
        EmployeSession session = employeSessionRepo.findById(sessionId).orElseThrow();
        session.setSessionEnd(LocalDateTime.now());
        employeSessionRepo.save(session);
    }

    public List<EmployeSession> getAllEmployeSessions(Integer entrepriseid) {
        return employeSessionRepo.findByEmployeEntrepriseId(entrepriseid);
    }

    public EmployeSession createEmployeSession(EmployeSession employeSession) {
        return employeSessionRepo.save(employeSession);
    }

    public boolean isSessionActive(Integer sessionId) {
        Optional<EmployeSession> optionalEmployeSession = employeSessionRepo.findById(sessionId);

        if (optionalEmployeSession.isPresent()) {
            EmployeSession employeSession = optionalEmployeSession.get();
            return employeSession.getSessionEnd() == null;
        }

        return false;
    }
}
