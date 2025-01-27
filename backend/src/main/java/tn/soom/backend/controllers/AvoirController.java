package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.*;
import tn.soom.backend.services.AvoirService;

import java.util.List;

@RestController
@RequestMapping("/avoirs")
public class AvoirController {

    @Autowired
    private AvoirService avoirService;

    // Créer un avoir en argent pour une facture
    @PostMapping("/argent/facture")
    public ResponseEntity<Avoir> creerAvoirEnArgent(@RequestBody Facture facture, @RequestParam double montantEcart) {
        Avoir avoir = avoirService.creerAvoirEnArgent(facture, montantEcart);
        return ResponseEntity.ok(avoir);
    }

    // Créer un avoir en argent pour une facture d'achat
    @PostMapping("/argent/factureAchat")
    public ResponseEntity<Avoir> creerAvoirEnArgent(@RequestBody FactureAchat factureAchat, @RequestParam double montantEcart) {
        Avoir avoir = avoirService.creerAvoirEnArgent(factureAchat, montantEcart);
        return ResponseEntity.ok(avoir);
    }

    // Créer un avoir en quantité pour une réception d'achat
    @PostMapping("/quantite/receptionAchat")
    public ResponseEntity<Avoir> creerAvoirEnQuantite(@RequestBody ReceptionAchat receptionAchat, @RequestParam String produit, @RequestParam int quantiteEcart) {
        Avoir avoir = avoirService.creerAvoirEnQuantite(receptionAchat, produit, quantiteEcart);
        return ResponseEntity.ok(avoir);
    }

    // Créer un avoir en quantité pour une sortie
    @PostMapping("/quantite/sortie")
    public ResponseEntity<Avoir> creerAvoirEnQuantite(@RequestBody Sortie sortie, @RequestParam String produit, @RequestParam int quantiteEcart) {
        Avoir avoir = avoirService.creerAvoirEnQuantite(sortie, produit, quantiteEcart);
        return ResponseEntity.ok(avoir);
    }

    // Obtenir les avoirs par ID d'entreprise
    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Avoir>> getAvoirByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Avoir> avoirs = avoirService.getAvoirByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(avoirs);
    }
}
