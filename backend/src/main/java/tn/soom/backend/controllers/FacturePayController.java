package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.soom.backend.entities.FacturePay;
import tn.soom.backend.services.FacturePayService;

@RestController
@RequestMapping("/facturepay")
public class FacturePayController {

    @Autowired
    private FacturePayService factureService;

    @PostMapping("/{employeId}")
    public ResponseEntity<FacturePay> creerFacture(@PathVariable Integer employeId) {
        FacturePay facture = factureService.creerFacturePourEmploye(employeId);
        return ResponseEntity.ok(facture);
    }
}
