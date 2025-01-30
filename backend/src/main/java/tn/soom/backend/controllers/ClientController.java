package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Client;
import tn.soom.backend.entities.Commande;
import tn.soom.backend.services.ClientService;
import tn.soom.backend.services.ModuleService;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @PostMapping
    public ResponseEntity<Client> addClient(@RequestBody Client client,
                                            @RequestParam Integer entrepriseId,
                                            @RequestParam String empEmail) {
        Client savedClient = clientService.addClient(client, entrepriseId, empEmail);
        return ResponseEntity.ok(savedClient);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> findOne(@PathVariable Integer id) {
        Client client = clientService.findOne(id);
        return ResponseEntity.ok(client);
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Client>> getClientsByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Client> clients = clientService.getClientByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(clients);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Integer id,
                                               @RequestBody Client updatedClient) {
        Client client = clientService.updateClient(id, updatedClient);
        return ResponseEntity.ok(client);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Integer id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
