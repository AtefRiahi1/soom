package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.entities.Module;
import tn.soom.backend.repositories.EmployeRepo;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.repositories.FournisseurRepo;
import tn.soom.backend.repositories.NotificationRepo;

import java.util.List;
import java.util.Optional;

@Service
public class FournisseurService {

    @Autowired
    private EntrepriseRepo entrepriseRepo;
    @Autowired
    private FournisseurRepo fournisseurRepo;
    @Autowired
    private NotificationRepo notificationRepository;

    public Fournisseur addFournisseur(Fournisseur fournisseur, Integer entrepriseId,String empEmail) {
        Entreprise entreprise = entrepriseRepo.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));

        fournisseur.setEntreprise(entreprise);


        Fournisseur savedFournisseur = fournisseurRepo.save(fournisseur);

        if (entreprise != null) {
            Notification notification = new Notification();
            notification.setTitle("Nouvel fournisseur ajouté");
            notification.setMessage("Un nouvel fournisseur, " + savedFournisseur.getNom() + ", a été ajouté à l'entreprise " + entreprise.getName() + ".");
            notification.setCreatedBy(empEmail);
            notification.setEntreprise(entreprise);
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        return savedFournisseur;
    }

    public List<Fournisseur> getFournisseurByEntrepriseId(Integer entrepriseId) {
        return fournisseurRepo.findByEntrepriseId(entrepriseId);
    }

    public Fournisseur findOne(Integer id) {
        return fournisseurRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable avec l'ID : " + id));
    }
    public Fournisseur updateFournisseur(Integer id, Fournisseur updatedFournisseur) {
        Optional<Fournisseur> existingFournisseur = fournisseurRepo.findById(id);
        if (existingFournisseur.isPresent()) {
            Fournisseur fournisseur = existingFournisseur.get();
            fournisseur.setNom(updatedFournisseur.getNom());
            fournisseur.setAdresse(updatedFournisseur.getAdresse());
            fournisseur.setLabel(updatedFournisseur.getLabel());
            fournisseur.setEmail(updatedFournisseur.getEmail());
            fournisseur.setTel(updatedFournisseur.getTel());
            return fournisseurRepo.save(fournisseur);
        } else {
            throw new IllegalArgumentException("Fournisseur non trouvé avec l'ID : " + id);
        }
    }

    public void deleteFournisseur(Integer id) {
        if (fournisseurRepo.existsById(id)) {
            fournisseurRepo.deleteById(id);
        } else {
            throw new IllegalArgumentException("Fournisseur non trouvé avec l'ID : " + id);
        }
    }
}
