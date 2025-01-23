package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Mouvement;
import tn.soom.backend.services.FournisseurService;
import tn.soom.backend.services.MouvementService;

import java.util.List;

@RestController
@RequestMapping("/mouvements")
public class MouvementController {
    @Autowired
    private MouvementService mouvementService;

    @PostMapping
    public ResponseEntity<Mouvement> createMovement(@RequestBody Mouvement mouvement,
                                                    @RequestParam Integer entrepriseId,
                                                    @RequestParam String empEmail) {
        Mouvement createdMouvement = mouvementService.createMovement(mouvement, entrepriseId, empEmail);
        return ResponseEntity.ok(createdMouvement);
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Mouvement>> getMouvementsByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Mouvement> mouvements = mouvementService.getMouvementByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(mouvements);
    }
}
