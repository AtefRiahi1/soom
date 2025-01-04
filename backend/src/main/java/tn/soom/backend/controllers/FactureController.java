package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.soom.backend.entities.FacturePay;
import tn.soom.backend.services.FactureService;

@RestController
@RequestMapping("/facturepay")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @PostMapping("/{employeId}")
    public ResponseEntity<FacturePay> creerFacture(@PathVariable Integer employeId) {
        FacturePay facture = factureService.creerFacturePourEmploye(employeId);
        return ResponseEntity.ok(facture);
    }
}
