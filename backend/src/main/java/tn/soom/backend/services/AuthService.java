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
            String verificationUrl = "http://localhost:9090/auth/verify?token=" + token;

            String emailTemplate = "<html>" +
                    "<body>" +
                    "<h1>Bienvenue sur notre plateforme, " + savedEntreprise.getName() + " !</h1>" +
                    "<p>Veuillez cliquer sur le lien suivant pour vérifier votre compte :</p>" +
                    "<a href=\"" + verificationUrl + "\">Vérifiez votre compte</a>" +
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
                if (employe.get().getIsverified()) {
                    var jwt = jwtUtils.generateToken(employe.get());
                    var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), employe.get());
                    response.setStatusCode(200);
                    response.setToken(jwt);
                    response.setRefreshToken(refreshToken);
                    response.setExpirationTime("24Hr");
                    response.setMessage("Bienvenue Employé " + employe.get().getEmail());
                    response.setUserType("employé");
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
