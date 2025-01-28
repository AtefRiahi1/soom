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
import tn.soom.backend.entities.Devis;
import tn.soom.backend.entities.Livraison;
import tn.soom.backend.entities.ReceptionAchat;
import tn.soom.backend.services.DevisService;
import tn.soom.backend.services.LivraisonService;
import tn.soom.backend.services.ReceptionAchatService;


import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static java.nio.file.Files.copy;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
@RestController
@RequestMapping("/livraison")
public class LivraisonController {
    @Autowired
    private LivraisonService livraisonService;
    public static final String DIRECTORY = System.getProperty("user.home") + "/Downloads/uploads/";

    @PostMapping
    public ResponseEntity<Livraison> create(@RequestBody Livraison livraison,
                                            @RequestParam Integer entrepriseId,
                                            @RequestParam Integer fournisseurId,
                                            @RequestParam String empEmail) {
        Livraison createdLivraison = livraisonService.create(livraison,entrepriseId,fournisseurId,empEmail);
        return ResponseEntity.ok(createdLivraison);
    }

    @PostMapping("/convertir/{commandeId}")
    public ResponseEntity<Livraison> convertirCommandeEnLivraison(
            @PathVariable Integer commandeId,
            @RequestParam String empEmail) {

        Livraison livraison = livraisonService.convertCommandeToLivraison(commandeId, empEmail);
        return ResponseEntity.ok(livraison);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livraison> findOne(@PathVariable Integer id) {
        Livraison livraison = livraisonService.findOne(id);
        return ResponseEntity.ok(livraison);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livraison> update(@PathVariable Integer id, @RequestBody Livraison updatedLivraison,@RequestParam String empEmail) {
        Livraison livraison = livraisonService.update(id, updatedLivraison,empEmail);
        return ResponseEntity.ok(livraison);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Integer id) {
        livraisonService.remove(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Livraison>> findByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Livraison> livraisons = livraisonService.findByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(livraisons);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = ((Authentication) authentication).getName();


        Path userDirectory = Paths.get(DIRECTORY, username,"Livraisons").toAbsolutePath().normalize();


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

        Path userDirectory = Paths.get(DIRECTORY, email, "Livraisons").toAbsolutePath().normalize();
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

}
