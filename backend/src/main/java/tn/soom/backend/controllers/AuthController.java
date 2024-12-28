package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.soom.backend.dto.SignIn;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.services.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody Entreprise entreprise){
        return ResponseEntity.ok(authService.signUpEntreprise(entreprise));
    }

    @PostMapping("/signin")
    public ResponseEntity<String> signIn(@RequestBody SignIn signInRequest){
        return ResponseEntity.ok(authService.signIn(signInRequest));
    }
}
