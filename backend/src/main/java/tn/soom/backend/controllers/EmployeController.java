package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.dto.UpdatePasswordRequest;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.services.EmployeService;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/{email}")
    public ResponseEntity<?> getEmployeByEmail(@PathVariable String email) {
        Optional<Employe> optionalEmploye = employeService.getEmployeByEmail(email);

        if (optionalEmploye.isPresent()) {
            return ResponseEntity.ok(optionalEmploye.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Employe non trouvée pour l'email : " + email);
        }
    }
}
