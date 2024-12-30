package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.services.EmployeService;

import java.util.List;

@RestController
@RequestMapping("/employe")
public class EmployeController {

    @Autowired
    private EmployeService employeService;
    @PostMapping
    public ResponseEntity<?> addEmploye(
            @RequestBody Employe employe,
            @RequestParam Integer entrepriseId,
            @RequestParam List<Integer> moduleIds) {
        Employe newEmploye = employeService.addEmploye(employe, entrepriseId, moduleIds);
        return ResponseEntity.ok(newEmploye);
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Employe>> getEmployesByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Employe> employes = employeService.getEmployesByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(employes);
    }
}
