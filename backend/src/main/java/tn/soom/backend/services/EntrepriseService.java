package tn.soom.backend.services;

import org.springframework.stereotype.Service;
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
}
