package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.entities.Module;
import tn.soom.backend.repositories.*;

import java.util.List;

@Service
public class EmployeService {
    @Autowired
    private EmployeRepo employeRepository;

    @Autowired
    private EntrepriseRepo entrepriseRepository;

    @Autowired
    private ModuleRepo moduleRepository;

    @Autowired
    private ModuleEmployeRepo moduleEmployeRepository;

    @Autowired
    private NotificationRepo notificationRepository;

    @Autowired
    private AdminERPRepo adminERPRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Employe addEmploye(Employe employe, Integer entrepriseId, List<Integer> moduleIds) {
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new IllegalArgumentException("Entreprise introuvable avec l'ID : " + entrepriseId));

        employe.setEntreprise(entreprise);

        employe.setPassword(passwordEncoder.encode(employe.getPassword()));

        Employe savedEmploye = employeRepository.save(employe);

        for (Integer moduleId : moduleIds) {
            Module module = moduleRepository.findById(moduleId)
                    .orElseThrow(() -> new IllegalArgumentException("Module introuvable avec l'ID : " + moduleId));
            ModuleEmploye moduleEmploye = new ModuleEmploye(savedEmploye, module);
            moduleEmployeRepository.save(moduleEmploye);
        }

        AdminERP admin = adminERPRepository.findByRole("ADMIN");
        if (admin != null) {
            Notification notification = new Notification();
            notification.setTitle("Nouvel employé ajouté");
            notification.setMessage("Un nouvel employé, " + savedEmploye.getEmail() + ", a été ajouté à l'entreprise " + entreprise.getName() + ".");
            notification.setCreatedBy(entreprise.getName());
            notification.setAdminERP(admin);
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        return savedEmploye;
    }

    public List<Employe> getEmployesByEntrepriseId(Integer entrepriseId) {
        return employeRepository.findByEntrepriseId(entrepriseId);
    }
}
