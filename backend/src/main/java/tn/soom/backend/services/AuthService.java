package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.soom.backend.dto.SignIn;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.repositories.AdminERPRepo;
import tn.soom.backend.repositories.EmployeRepo;
import tn.soom.backend.repositories.EntrepriseRepo;

import java.util.HashMap;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private EmployeRepo employeRepo;
    @Autowired
    private AdminERPRepo adminERPRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserDetailsService userDetailsService;

    public String signUpEntreprise(Entreprise entreprise) {
        if (entrepriseRepo.existsByEmail(entreprise.getEmail())) {
            throw new IllegalArgumentException("L'entreprise avec cet email existe déjà.");
        }

        entreprise.setPassword(passwordEncoder.encode(entreprise.getPassword()));

        entreprise.setIsverified(false);

        Entreprise savedEntreprise = entrepriseRepo.save(entreprise);

        String token = jwtUtils.generateToken(savedEntreprise);

        String verificationUrl = "http://example.com/verify?token=" + token;

        String emailTemplate = "<html>" +
                "<body>" +
                "<h1>Bienvenue sur notre plateforme, " + savedEntreprise.getName() + " !</h1>" +
                "<p>Veuillez cliquer sur le lien suivant pour vérifier votre compte :</p>" +
                "<a href=\"" + verificationUrl + "\">Vérifiez votre compte</a>" +
                "</body>" +
                "</html>";

        emailService.sendEmail(savedEntreprise.getEmail(), "Confirmation de vérification de compte", emailTemplate);

        return "Enregistrement réussi. Un email de vérification a été envoyé à votre adresse.";
    }

    public String signIn(SignIn signIn) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signIn.getEmail(), signIn.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            Optional<AdminERP> adminERP = adminERPRepo.findByEmail(signIn.getEmail());
            if (adminERP.isPresent()) {
                var jwt = jwtUtils.generateToken(adminERP.get());
                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), adminERP.get());
                return "Bienvenue AdminERP " + adminERP.get().getEmail() + " token:" + jwt;
            }

            Optional<Entreprise> entreprise = entrepriseRepo.findByEmail(signIn.getEmail());
            if (entreprise.isPresent()) {
                var jwt = jwtUtils.generateToken(entreprise.get());
                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), entreprise.get());
                return "Bienvenue Entreprise " + entreprise.get().getName() + " token:" + jwt;
            }

            Optional<Employe> employe = employeRepo.findByEmail(signIn.getEmail());
            if (employe.isPresent()) {
                var jwt = jwtUtils.generateToken(employe.get());
                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), employe.get());
                return "Bienvenue Employé " + employe.get().getEmail() + " token:" + jwt;
            }

        } catch (BadCredentialsException e) {
            return "Erreur d'authentification : Email ou mot de passe incorrect.";
        } catch (Exception e) {
            throw new RuntimeException("Échec de l'authentification", e);
        }
        return "Aucun utilisateur trouvé avec ces informations.";
    }



}
