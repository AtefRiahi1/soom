package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.entities.Module;
import tn.soom.backend.repositories.*;

import java.util.List;
import java.util.Optional;

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

    public Employe updateEmployeStatus(Integer employeId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable avec l'ID : " + employeId));

        employe.setStatus(!employe.getStatus());
        return employeRepository.save(employe);
    }

    public Employe updateEmployeverif(Integer employeId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable avec l'ID : " + employeId));

        employe.setIsverified(!employe.getIsverified());
        return employeRepository.save(employe);
    }

    public Employe manageEmployeData(Integer employeId, Employe updatedEmploye,
                                     List<Integer> addModuleIds, List<Integer> removeModuleIds) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new IllegalArgumentException("Employé introuvable avec l'ID : " + employeId));

        if (updatedEmploye.getEmail() != null) {
            employe.setEmail(updatedEmploye.getEmail());
        }
        if (updatedEmploye.getPassword() != null) {
            employe.setPassword(passwordEncoder.encode(updatedEmploye.getPassword())); // Encoder le mot de passe
        }

        if (addModuleIds != null && !addModuleIds.isEmpty()) {
            for (Integer moduleId : addModuleIds) {
                Module module = moduleRepository.findById(moduleId)
                        .orElseThrow(() -> new IllegalArgumentException("Module introuvable avec l'ID : " + moduleId));

                ModuleEmploye existingModuleEmploye = employe.getModules().stream()
                        .filter(me -> me.getModule().getId().equals(moduleId))
                        .findFirst()
                        .orElse(null);

                if (existingModuleEmploye != null) {
                    if (!existingModuleEmploye.getStatus()) {
                        existingModuleEmploye.setStatus(true);
                        moduleEmployeRepository.save(existingModuleEmploye);
                    }
                } else {
                    ModuleEmploye moduleEmploye = new ModuleEmploye(employe, module);
                    moduleEmployeRepository.save(moduleEmploye);

                    notifyAdminNewModule(employe, module);
                }
            }
        }

        if (removeModuleIds != null && !removeModuleIds.isEmpty()) {
            for (Integer moduleId : removeModuleIds) {
                ModuleEmploye moduleEmploye = moduleEmployeRepository.findByEmployeIdAndModuleId(employeId, moduleId)
                        .orElseThrow(() -> new IllegalArgumentException("Aucune association trouvée pour le module et l'employé."));

                moduleEmploye.setStatus(false);
                moduleEmployeRepository.save(moduleEmploye);
                notifyEmployeDeletedModule(employe,moduleEmploye.getModule());
            }
        }

        return employeRepository.save(employe);
    }


    private void notifyAdminNewModule(Employe employe, Module module) {
        AdminERP admin = adminERPRepository.findByRole("ADMIN");
        if (admin != null) {
            Notification notification = new Notification();
            notification.setTitle("Nouveau module assigné");
            notification.setMessage("Le module " + module.getNom() + " a été assigné à l'employé " + employe.getEmail() + ".");
            notification.setCreatedBy(employe.getEntreprise().getName());
            notification.setAdminERP(admin);
            notification.setRead(false);
            notificationRepository.save(notification);
        }
    }
    private void notifyEmployeDeletedModule(Employe employe, Module module) {
            Notification notification = new Notification();
            notification.setTitle("Module retiré");
            notification.setMessage("Le module " + module.getNom() + " a été retiré de vos modules.");
            notification.setCreatedBy(employe.getEntreprise().getName());
            notification.setEmploye(employe);
            notification.setRead(false);
            notificationRepository.save(notification);
    }

    public Employe updateEmployePassword(Integer id, String newPassword) {
        Optional<Employe> existingEmploye = employeRepository.findById(id);
        if (existingEmploye.isPresent()) {
            Employe employe = existingEmploye.get();
            employe.setPassword(passwordEncoder.encode(newPassword));

            return employeRepository.save(employe);
        }
        return null;
    }
}
