package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.services.JWTUtils;

@Controller
@RequestMapping("/account")
public class VerifyAccountController {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @GetMapping("/verify")
    public String verifyAccount(@RequestParam("token") String token, Model model) {
        try {
            String email = jwtUtils.validateTokenAndGetEmail(token);

            Entreprise entreprise = entrepriseRepo.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Aucune entreprise trouvée pour cet email."));

            if (entreprise.getIsverified()) {
                model.addAttribute("message", "Le compte est déjà vérifié.");
                return "error";
            }

            entreprise.setIsverified(true);
            entrepriseRepo.save(entreprise);

            model.addAttribute("message", "Votre compte a été vérifié avec succès !");
            return "success";
        } catch (Exception e) {
            model.addAttribute("message", "Échec de la vérification : " + e.getMessage());
            return "error";
        }
    }
}
