package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.EmployeSession;
import tn.soom.backend.entities.EntrepriseSession;
import tn.soom.backend.services.EmployeSessionService;
import tn.soom.backend.services.EntrepriseSessionService;

import java.util.List;

@RestController
@RequestMapping("/entsessions")
public class EntrepriseSessionController {
    @Autowired
    private EntrepriseSessionService entrepriseSessionService;

    @PostMapping("/start")
    public EntrepriseSession startSession(@RequestParam String entMail) {
        return entrepriseSessionService.createSession(entMail);
    }

    @PostMapping("/end")
    public void endSession(@RequestParam Integer sessionId) {
        entrepriseSessionService.endSession(sessionId);
    }

    @PostMapping
    public ResponseEntity<EntrepriseSession> createEntrepriseSession(@RequestBody EntrepriseSession entrepriseSession) {
        EntrepriseSession createdEntrepriseSession = entrepriseSessionService.createEntrepriseSession(entrepriseSession);
        return new ResponseEntity<>(createdEntrepriseSession, HttpStatus.CREATED);
    }
    @GetMapping("/{id}/active")
    public ResponseEntity<Boolean> isSessionActive(@PathVariable Integer id) {
        boolean isActive = entrepriseSessionService.isSessionActive(id);
        return new ResponseEntity<>(isActive, HttpStatus.OK);
    }
}
