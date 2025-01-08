package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.*;
import tn.soom.backend.repositories.AdminERPRepo;
import tn.soom.backend.repositories.EmployeRepo;
import tn.soom.backend.repositories.ModuleEmployeRepo;
import tn.soom.backend.repositories.NotificationRepo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ModuleEmployeService {
    @Autowired
    private ModuleEmployeRepo moduleEmployeRepository;
    @Autowired
    private NotificationRepo notificationRepository;
    @Autowired
    private AdminERPRepo adminERPRepository;
    @Autowired
    private EmployeRepo employeRepo;


    public List<ModuleEmploye> getModuleEmployeByEmployeId(Integer empId) {
        return moduleEmployeRepository.findByEmployeId(empId);
    }

    public Optional<ModuleEmploye> updateModuleEmployePermissions(Integer id, boolean consulter, boolean modifier, boolean ajouter, boolean supprimer) {
        Optional<ModuleEmploye> moduleEmployeOptional = moduleEmployeRepository.findById(id);

        if (moduleEmployeOptional.isPresent()) {
            ModuleEmploye moduleEmploye = moduleEmployeOptional.get();
            moduleEmploye.setConsulter(consulter);
            moduleEmploye.setModifier(modifier);
            moduleEmploye.setAjouter(ajouter);
            moduleEmploye.setSupprimer(supprimer);
            Notification notification = new Notification();
            notification.setTitle("Permissions changées");
            notification.setMessage("Vos permissions dans le module "+ moduleEmploye.getModule().getNom() +" ont été changées .");
            notification.setCreatedBy(moduleEmploye.getEmploye().getEntreprise().getName());
            notification.setEmploye(moduleEmploye.getEmploye());
            notification.setRead(false);
            notificationRepository.save(notification);
            return Optional.of(moduleEmployeRepository.save(moduleEmploye));
        } else {
            return Optional.empty();
        }
    }

    public ModuleEmploye updateModuleEmployePaye(Integer moduleemployeId) {
        ModuleEmploye moduleEmploye = moduleEmployeRepository.findById(moduleemployeId)
                .orElseThrow(() -> new IllegalArgumentException("Module introuvable avec l'ID : " + moduleemployeId));

        moduleEmploye.setPaye(true);
        moduleEmploye.setPaymentDate(LocalDateTime.now());
        AdminERP admin = adminERPRepository.findByRole("ADMIN");
        Notification notification = new Notification();
        notification.setTitle("Module accessible");
        notification.setMessage("Le module "+ moduleEmploye.getModule().getNom() +" est maintenant accessible.");
        notification.setCreatedBy(admin.getEmail());
        notification.setEntreprise(moduleEmploye.getEmploye().getEntreprise());
        notification.setRead(false);
        notificationRepository.save(notification);
        return moduleEmployeRepository.save(moduleEmploye);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void resetModuleEmployePaymentStatus() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);

        List<ModuleEmploye> modulesToUpdate = moduleEmployeRepository.findAllByPaymentDateBefore(oneMonthAgo);
        AdminERP admin = adminERPRepository.findByRole("ADMIN");

        for (ModuleEmploye moduleEmploye : modulesToUpdate) {
            moduleEmploye.setPaye(false);
            moduleEmploye.setPaymentDate(null);
            Notification notification = new Notification();
            notification.setTitle("Module retiré");
            notification.setMessage("Le module "+ moduleEmploye.getModule().getNom() + "a été retiré de l'employé "+ moduleEmploye.getEmploye().getEmail() +" .");
            notification.setCreatedBy(admin.getEmail());
            notification.setEntreprise(moduleEmploye.getEmploye().getEntreprise());
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        moduleEmployeRepository.saveAll(modulesToUpdate);

        System.out.println("Mise à jour des modules employé effectuée : " + modulesToUpdate.size() + " modules mis à jour.");
    }

    public List<ModuleEmploye> getModuleByEntrepriseId(Integer entrepriseid) {
        return moduleEmployeRepository.findByEmployeEntrepriseId(entrepriseid);
    }

    public ModuleEmploye updateModuleEmployeResponsable(Integer moduleemployeId,Integer empId) {
        ModuleEmploye moduleEmploye = moduleEmployeRepository.findById(moduleemployeId)
                .orElseThrow(() -> new IllegalArgumentException("Module introuvable avec l'ID : " + moduleemployeId));
        Employe employe = employeRepo.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("Employe introuvable avec l'ID : " + empId));

        moduleEmploye.setEmploye(employe);
        Notification notification = new Notification();
        notification.setTitle("Nouveau module");
        notification.setMessage("Le module "+ moduleEmploye.getModule().getNom() +" est ajouté à vos modules.");
        notification.setCreatedBy(moduleEmploye.getEmploye().getEntreprise().getName());
        notification.setEmploye(moduleEmploye.getEmploye());
        notification.setRead(false);
        notificationRepository.save(notification);
        return moduleEmployeRepository.save(moduleEmploye);
    }
}
