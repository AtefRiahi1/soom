package tn.soom.backend.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.repositories.EntrepriseRepo;

import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseService {
    private final EntrepriseRepo entrepriseRepository;
    private final PasswordEncoder passwordEncoder;

    public EntrepriseService(EntrepriseRepo entrepriseRepository, PasswordEncoder passwordEncoder) {
        this.entrepriseRepository = entrepriseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    public Entreprise updateEntrepriseStatus(Integer entrepriseId) {
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));

        entreprise.setIsverified(!entreprise.getIsverified());
        return entrepriseRepository.save(entreprise);
    }

    public Entreprise updateEntreprisePassword(Integer id, String newPassword) {
        Optional<Entreprise> existingEntreprise = entrepriseRepository.findById(id);
        if (existingEntreprise.isPresent()) {
            Entreprise entreprise = existingEntreprise.get();
            entreprise.setPassword(passwordEncoder.encode(newPassword));

            return entrepriseRepository.save(entreprise);
        }
        return null;
    }

    public Optional<Entreprise> getEntrepriseByEmail(String email) {
        return entrepriseRepository.findByEmail(email);
    }
}
