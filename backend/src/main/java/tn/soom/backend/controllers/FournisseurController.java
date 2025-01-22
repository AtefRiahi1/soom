package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Fournisseur;
import tn.soom.backend.services.FournisseurService;
import tn.soom.backend.services.ModuleService;

import java.util.List;

@RestController
@RequestMapping("/fournisseurs")
public class FournisseurController {
    @Autowired
    private FournisseurService fournisseurService;

    @PostMapping
    public ResponseEntity<Fournisseur> addFournisseur(@RequestBody Fournisseur fournisseur,
                                                      @RequestParam Integer entrepriseId,
                                                      @RequestParam String empEmail) {
        Fournisseur savedFournisseur = fournisseurService.addFournisseur(fournisseur, entrepriseId, empEmail);
        return ResponseEntity.ok(savedFournisseur);
    }

    @GetMapping("/{entrepriseId}")
    public ResponseEntity<List<Fournisseur>> getFournisseursByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Fournisseur> fournisseurs = fournisseurService.getFournisseurByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(fournisseurs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fournisseur> updateFournisseur(@PathVariable Integer id,
                                                         @RequestBody Fournisseur updatedFournisseur) {
        Fournisseur fournisseur = fournisseurService.updateFournisseur(id, updatedFournisseur);
        return ResponseEntity.ok(fournisseur);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFournisseur(@PathVariable Integer id) {
        fournisseurService.deleteFournisseur(id);
        return ResponseEntity.noContent().build();
    }
}
