package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.dto.UpdatePasswordRequest;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
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

    @PutMapping("/status/{employeId}")
    public ResponseEntity<Employe> updateEmployeStatus(@PathVariable Integer employeId) {
        Employe updatedEmploye = employeService.updateEmployeStatus(employeId);
        return ResponseEntity.ok(updatedEmploye);
    }

    @PutMapping("/verif/{employeId}")
    public ResponseEntity<Employe> updateEmployeVerif(@PathVariable Integer employeId) {
        Employe updatedEmploye = employeService.updateEmployeverif(employeId);
        return ResponseEntity.ok(updatedEmploye);
    }

    @PutMapping("/{employeId}")
    public ResponseEntity<Employe> manageEmployeData(
            @PathVariable Integer employeId,
            @RequestBody Employe updateEmploye,
            @RequestParam List<Integer> addModuleIds,
            @RequestParam List<Integer> removeModuleIds) {

        Employe updatedEmploye = employeService.manageEmployeData(
                employeId,
                updateEmploye,
                addModuleIds,
                removeModuleIds
        );
        return ResponseEntity.ok(updatedEmploye);
    }

    @PutMapping("/{id}/updatePassword")
    public ResponseEntity<Employe> updateEmployePassword(@PathVariable Integer id, @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        String newPassword = updatePasswordRequest.getNewPassword();
        System.out.println("New password received: " + newPassword);

        if (newPassword != null && !newPassword.isEmpty()) {
            Employe updatedEmploye = employeService.updateEmployePassword(id, newPassword);

            if (updatedEmploye != null) {
                return ResponseEntity.ok(updatedEmploye);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
