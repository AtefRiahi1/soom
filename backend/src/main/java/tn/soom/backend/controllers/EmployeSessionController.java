package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.EmployeSession;
import tn.soom.backend.services.EmployeSessionService;

import java.util.List;

@RestController
@RequestMapping("/empsessions")
public class EmployeSessionController {

    @Autowired
    private EmployeSessionService employeSessionService;

    @PostMapping("/start")
    public EmployeSession startSession(@RequestParam String empMail) {
        return employeSessionService.createSession(empMail);
    }

    @PostMapping("/end")
    public void endSession(@RequestParam Integer sessionId) {
        employeSessionService.endSession(sessionId);
    }

    @GetMapping
    public ResponseEntity<List<EmployeSession>> getAllEmployeSessions(@RequestParam Integer entrId) {
        List<EmployeSession> employeSessions = employeSessionService.getAllEmployeSessions(entrId);
        return new ResponseEntity<>(employeSessions, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<EmployeSession> createEmployeSession(@RequestBody EmployeSession employeSession) {
        EmployeSession createdEmployeSession = employeSessionService.createEmployeSession(employeSession);
        return new ResponseEntity<>(createdEmployeSession, HttpStatus.CREATED);
    }
    @GetMapping("/{id}/active")
    public ResponseEntity<Boolean> isSessionActive(@PathVariable Integer id) {
        boolean isActive = employeSessionService.isSessionActive(id);
        return new ResponseEntity<>(isActive, HttpStatus.OK);
    }
}
