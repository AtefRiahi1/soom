package tn.soom.backend.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.soom.backend.entities.CommandeAchat;
import tn.soom.backend.entities.Facture;
import tn.soom.backend.entities.FactureAchat;
import tn.soom.backend.services.CommandeAchatService;
import tn.soom.backend.services.FactureAchatService;
import tn.soom.backend.services.FactureService;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static java.nio.file.Files.copy;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@RestController
@RequestMapping("/facture")
public class FactureController {
    @Autowired
    private FactureService factureService;
    public static final String DIRECTORY = System.getProperty("user.home") + "/Downloads/uploads/";

    @PostMapping
    public ResponseEntity<Facture> create(@RequestBody Facture facture,
                                          @RequestParam Integer entrepriseId,
                                          @RequestParam Integer fournisseurId,
                                          @RequestParam String empEmail) {
        Facture createdFacture = factureService.create(facture,entrepriseId,fournisseurId,empEmail);
        return ResponseEntity.ok(createdFacture);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> findOne(@PathVariable Integer id) {
        Facture facture = factureService.findOne(id);
        return ResponseEntity.ok(facture);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> update(@PathVariable Integer id, @RequestBody Facture updatedFacture,@RequestParam String empEmail) {
        Facture facture = factureService.update(id, updatedFacture,empEmail);
        return ResponseEntity.ok(facture);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Integer id) {
        factureService.remove(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Facture>> findByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Facture> factures = factureService.findByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(factures);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = ((Authentication) authentication).getName();


        Path userDirectory = Paths.get(DIRECTORY, username,"Factures").toAbsolutePath().normalize();


        if (!userDirectory.toFile().exists()) {
            userDirectory.toFile().mkdirs();
        }


        String filename = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        Path fileStorage = userDirectory.resolve(filename);


        copy(multipartFile.getInputStream(), fileStorage, REPLACE_EXISTING);

        return ResponseEntity.ok().body(filename);
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> serveImage(
            @PathVariable String fileName,
            @RequestParam String email) {

        Path userDirectory = Paths.get(DIRECTORY, email, "Factures").toAbsolutePath().normalize();
        Path imagePath = userDirectory.resolve(fileName);

        System.out.println("Resolved file path: " + imagePath.toString());

        try {
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(resource);
            } else {
                System.out.println("Resource does not exist or is not readable.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/paye/{factureId}")
    public ResponseEntity<Facture> updateFacturePaye(@PathVariable Integer factureId) {
        Facture updatedFacture = factureService.updateFactureStatus(factureId);
        return ResponseEntity.ok(updatedFacture);
    }
}
