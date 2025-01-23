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
import tn.soom.backend.services.CommandeAchatService;
import tn.soom.backend.services.MouvementService;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static java.nio.file.Files.copy;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@RestController
@RequestMapping("/commandeachats")
public class CommandeAchatController {
    @Autowired
    private CommandeAchatService commandeAchatService;
    public static final String DIRECTORY = System.getProperty("user.home") + "/Downloads/uploads/";

    @PostMapping
    public ResponseEntity<CommandeAchat> create(@RequestBody CommandeAchat commandeAchat,
                                                @RequestParam Integer entrepriseId,
                                                @RequestParam Integer fournisseurId,
                                                @RequestParam String empEmail) {
        CommandeAchat createdCommandeAchat = commandeAchatService.create(commandeAchat,entrepriseId,fournisseurId,empEmail);
        return ResponseEntity.ok(createdCommandeAchat);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommandeAchat> findOne(@PathVariable Integer id) {
        CommandeAchat commandeAchat = commandeAchatService.findOne(id);
        return ResponseEntity.ok(commandeAchat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommandeAchat> update(@PathVariable Integer id, @RequestBody CommandeAchat updatedCommandeAchat,@RequestParam String empEmail) {
        CommandeAchat commandeAchat = commandeAchatService.update(id, updatedCommandeAchat,empEmail);
        return ResponseEntity.ok(commandeAchat);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Integer id) {
        commandeAchatService.remove(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<CommandeAchat>> findByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<CommandeAchat> commandes = commandeAchatService.findByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(commandes);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = ((Authentication) authentication).getName();


        Path userDirectory = Paths.get(DIRECTORY, username,"Commandes Achat").toAbsolutePath().normalize();


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

        Path userDirectory = Paths.get(DIRECTORY, email, "Commandes Achat").toAbsolutePath().normalize();
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
