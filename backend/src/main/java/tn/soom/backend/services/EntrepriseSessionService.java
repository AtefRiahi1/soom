package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.EmployeSession;
import tn.soom.backend.entities.EntrepriseSession;
import tn.soom.backend.repositories.EmployeSessionRepo;
import tn.soom.backend.repositories.EntrepriseSessionRepo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseSessionService {
    @Autowired
    private EntrepriseSessionRepo entrepriseSessionRepo;

    public EntrepriseSession createSession(String entMail) {
        EntrepriseSession session = new EntrepriseSession();
        session.setEntrepriseemail(entMail);
        session.setSessionStart(LocalDateTime.now());
        return entrepriseSessionRepo.save(session);
    }

    public void endSession(Integer sessionId) {
        EntrepriseSession session = entrepriseSessionRepo.findById(sessionId).orElseThrow();
        session.setSessionEnd(LocalDateTime.now());
        entrepriseSessionRepo.save(session);
    }

    public EntrepriseSession createEntrepriseSession(EntrepriseSession entrepriseSession) {
        return entrepriseSessionRepo.save(entrepriseSession);
    }

    public boolean isSessionActive(Integer sessionId) {
        Optional<EntrepriseSession> optionalEntrepriseSession = entrepriseSessionRepo.findById(sessionId);

        if (optionalEntrepriseSession.isPresent()) {
            EntrepriseSession entrepriseSession = optionalEntrepriseSession.get();
            return entrepriseSession.getSessionEnd() == null;
        }

        return false;
    }
}
