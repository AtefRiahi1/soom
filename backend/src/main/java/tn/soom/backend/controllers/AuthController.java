package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.soom.backend.dto.ReqRes;
import tn.soom.backend.dto.SignIn;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.services.AuthService;
import tn.soom.backend.services.JWTUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.nio.file.Files.copy;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    public static final String DIRECTORY = System.getProperty("user.home") + "/Downloads/uploads/";

    @PostMapping("/signup")
    public ResponseEntity<ReqRes> signUp(@RequestBody Entreprise entreprise){
        return ResponseEntity.ok(authService.signUpEntreprise(entreprise));
    }



    @PostMapping("/signin")
    public ResponseEntity<ReqRes> signIn(@RequestBody SignIn signInRequest){
        return ResponseEntity.ok(authService.signIn(signInRequest));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile multipartFile,
            @RequestParam("username") String username) throws IOException {

        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }

        Path userDirectory = Paths.get(DIRECTORY, username, "Logo").toAbsolutePath().normalize();

        if (!userDirectory.toFile().exists()) {
            userDirectory.toFile().mkdirs();
        }

        String filename = StringUtils.cleanPath(multipartFile.getOriginalFilename());
        Path fileStorage = userDirectory.resolve(filename);

        copy(multipartFile.getInputStream(), fileStorage, REPLACE_EXISTING);

        return ResponseEntity.ok().body("File uploaded successfully: " + filename);
    }


    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String fileName,
            @RequestParam String email) {

        Path userDirectory = Paths.get(DIRECTORY, email, "Logo").toAbsolutePath().normalize();
        Path filePath = userDirectory.resolve(fileName);

        System.out.println("Resolved file path: " + filePath.toString());

        try {
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Déterminer le type de contenu
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream"; // Type par défaut si le type MIME est inconnu
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
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
