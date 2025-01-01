package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.services.EntrepriseService;

import java.util.List;

@RestController
@RequestMapping("/entreprise")
public class EntrepriseController {
    @Autowired
    private EntrepriseService entrepriseService;

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
}
