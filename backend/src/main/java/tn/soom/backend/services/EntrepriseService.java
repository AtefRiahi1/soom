package tn.soom.backend.services;

import org.springframework.stereotype.Service;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.repositories.EntrepriseRepo;

import java.util.List;

@Service
public class EntrepriseService {
    private final EntrepriseRepo entrepriseRepository;

    public EntrepriseService(EntrepriseRepo entrepriseRepository) {
        this.entrepriseRepository = entrepriseRepository;
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
}
