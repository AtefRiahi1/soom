package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.soom.backend.dto.ReqRes;
import tn.soom.backend.dto.SignIn;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.entities.Notification;
import tn.soom.backend.repositories.AdminERPRepo;
import tn.soom.backend.repositories.EmployeRepo;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.repositories.NotificationRepo;

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
    private NotificationRepo notificationRepo;
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

    public ReqRes signUpEntreprise(Entreprise entreprise) {
        ReqRes resp = new ReqRes();
        try {
            if (entrepriseRepo.existsByEmail(entreprise.getEmail())) {
                throw new IllegalArgumentException("L'entreprise avec cet email existe déjà.");
            }

            entreprise.setPassword(passwordEncoder.encode(entreprise.getPassword()));

            entreprise.setIsverified(false);

            Entreprise savedEntreprise = entrepriseRepo.save(entreprise);
            resp.setEntreprise(savedEntreprise);
            resp.setMessage("Enregistrement réussi. Un email de vérification a été envoyé à votre adresse.");
            resp.setStatusCode(200);

            String token = jwtUtils.generateToken(savedEntreprise);
            String verificationUrl = "http://localhost:9090/account/verify?token=" + token;

            String emailTemplate = "<!DOCTYPE html>" +
                    "<html lang='en'>" +
                    "<head>" +
                    "<meta charset='UTF-8'>" +
                    "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                    "<title>Vérification de Compte</title>" +
                    "<style>" +
                    "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }" +
                    ".email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); padding: 20px; }" +
                    ".header { background-color: #003366; color: #ffffff; padding: 15px 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px; }" +
                    ".header h1 { margin: 0; font-size: 24px; }" +
                    ".content { padding: 20px; font-size: 16px; line-height: 1.6; }" +
                    ".content p { margin: 10px 0; }" +
                    ".content a { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #003366; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; }" +
                    ".content a:hover { background-color: #002d4d; }" +
                    ".footer { margin-top: 20px; text-align: center; font-size: 12px; color: #999; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='email-container'>" +
                    "<div class='header'>" +
                    "<h1>Bienvenue, " + savedEntreprise.getName() + " !</h1>" +
                    "</div>" +
                    "<div class='content'>" +
                    "<p>Merci de vous être inscrit sur notre plateforme. Nous sommes ravis de vous compter parmi nous.</p>" +
                    "<p>Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>" +
                    "<a href='" + verificationUrl + "'>Vérifier mon compte</a>" +
                    "<p>Si vous n'avez pas créé ce compte, veuillez ignorer cet email.</p>" +
                    "</div>" +
                    "<div class='footer'>" +
                    "© 2025 HorizonData. Tous droits réservés." +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";



            emailService.sendEmail(savedEntreprise.getEmail(), "Confirmation de vérification de compte", emailTemplate);

            AdminERP admin = adminERPRepo.findByRole("ADMIN");
            if (admin!= null) {
                Notification notification = new Notification();
                notification.setTitle("Nouvelle entreprise crée");
                notification.setMessage("Une nouvelle entreprise, " + savedEntreprise.getName() + ", a été crée.");
                notification.setCreatedBy(savedEntreprise.getName());
                notification.setAdminERP(admin);
                notification.setRead(false);
                notificationRepo.save(notification);
            }

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqRes signIn(SignIn signIn) {
        ReqRes response = new ReqRes();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signIn.getEmail(), signIn.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            Optional<AdminERP> adminERP = adminERPRepo.findByEmail(signIn.getEmail());
            if (adminERP.isPresent()) {
                var jwt = jwtUtils.generateToken(adminERP.get());
                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), adminERP.get());
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshToken);
                response.setExpirationTime("24Hr");
                response.setMessage("Bienvenue AdminERP " + adminERP.get().getEmail());
                response.setUserType("admin");
            }

            Optional<Entreprise> entreprise = entrepriseRepo.findByEmail(signIn.getEmail());
            if (entreprise.isPresent()) {
                if (entreprise.get().getIsverified()) {
                    var jwt = jwtUtils.generateToken(entreprise.get());
                    var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), entreprise.get());
                    response.setStatusCode(200);
                    response.setToken(jwt);
                    response.setRefreshToken(refreshToken);
                    response.setExpirationTime("24Hr");
                    response.setMessage("Bienvenue Entreprise " + entreprise.get().getName());
                    response.setUserType("entreprise");
                } else {
                    response.setStatusCode(403);
                    response.setError("Votre compte d'entreprise n'est pas vérifié.");
                }
            }

            Optional<Employe> employe = employeRepo.findByEmail(signIn.getEmail());
            if (employe.isPresent()) {
                if (employe.get().getIsverified() && employe.get().getStatus()) {
                    var jwt = jwtUtils.generateToken(employe.get());
                    var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), employe.get());
                    response.setStatusCode(200);
                    response.setToken(jwt);
                    response.setRefreshToken(refreshToken);
                    response.setExpirationTime("24Hr");
                    response.setMessage("Bienvenue Employé " + employe.get().getEmail());
                    response.setUserType("employe");
                } else {
                    response.setStatusCode(403);
                    response.setError("Votre compte d'employé n'est pas vérifié.");
                }
            }

        } catch (BadCredentialsException e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }



}
