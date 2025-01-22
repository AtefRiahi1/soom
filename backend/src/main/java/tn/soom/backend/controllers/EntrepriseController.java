package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.dto.UpdatePasswordRequest;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.services.EntrepriseService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/entreprise")
public class EntrepriseController {
    @Autowired
    private EntrepriseService entrepriseService;

    @GetMapping("/recommended")
    public List<Integer> getRecommendedModules(@RequestParam int moduleId) {
        return entrepriseService.getRecommendedModules(moduleId);
    }

    @GetMapping
    public ResponseEntity<List<Entreprise>> getAllEntreprises() {
        List<Entreprise> entreprises = entrepriseService.getAllEntreprises();
        return ResponseEntity.ok(entreprises);
    }

    @PutMapping("/status/{entrepriseId}")
    public ResponseEntity<Entreprise> updateEntrepriseStatus(@PathVariable Integer entrepriseId) {
        Entreprise updatedEntreprise = entrepriseService.updateEntrepriseStatus(entrepriseId);
        return ResponseEntity.ok(updatedEntreprise);
    }

    @PutMapping("/{id}/updatePassword")
    public ResponseEntity<Entreprise> updateEntreprisePassword(@PathVariable Integer id, @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        String newPassword = updatePasswordRequest.getNewPassword();
        System.out.println("New password received: " + newPassword);

        if (newPassword != null && !newPassword.isEmpty()) {
            Entreprise updatedEntreprise = entrepriseService.updateEntreprisePassword(id, newPassword);

            if (updatedEntreprise != null) {
                return ResponseEntity.ok(updatedEntreprise);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getEntrepriseByEmail(@PathVariable String email) {
        Optional<Entreprise> entrepriseOptional = entrepriseService.getEntrepriseByEmail(email);

        if (entrepriseOptional.isPresent()) {
            return ResponseEntity.ok(entrepriseOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Entreprise non trouvée pour l'email : " + email);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entreprise> updateEntreprise(@PathVariable Integer id,
                                                       @RequestBody Entreprise updatedEntreprise) {
        Entreprise entreprise = entrepriseService.updateEntreprise(id, updatedEntreprise);
        return ResponseEntity.ok(entreprise);
    }
}
