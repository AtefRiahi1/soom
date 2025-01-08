package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.FacturePay;
import tn.soom.backend.entities.ModuleEmploye;
import tn.soom.backend.entities.Notification;
import tn.soom.backend.repositories.AdminERPRepo;
import tn.soom.backend.repositories.FacturePayRepo;
import tn.soom.backend.repositories.ModuleEmployeRepo;
import tn.soom.backend.repositories.NotificationRepo;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FacturePayService {

    @Autowired
    private FacturePayRepo factureRepo;

    @Autowired
    private ModuleEmployeRepo moduleEmployeRepo;
    @Autowired
    private EmailService emailService;
    @Autowired
    private NotificationRepo notificationRepository;
    @Autowired
    private AdminERPRepo adminERPRepository;

    public FacturePay creerFacturePourEmploye(Integer employeId) {
        List<ModuleEmploye> modulesNonPayes = moduleEmployeRepo.findByEmployeIdAndPayeFalseAndStatusTrue(employeId);

        if (modulesNonPayes.isEmpty()) {
            throw new IllegalArgumentException("Aucun module non payé pour cet employé.");
        }

        FacturePay facture = new FacturePay();
        facture.setDateCreation(LocalDateTime.now());
        facture.setEmploye(modulesNonPayes.get(0).getEmploye());
        facture.setPayee(false);

        double montantTotal = modulesNonPayes.stream()
                .mapToDouble(module -> module.getModule().getPrix())
                .sum();

        facture.setMontantTotal(montantTotal);
        facture = factureRepo.save(facture);

        AdminERP admin = adminERPRepository.findByRole("ADMIN");
        Notification notification = new Notification();
        notification.setTitle("Facture générée");
        notification.setMessage("Une nouvelle facture de " + montantTotal + " a été générée pour vos modules non payés.");
        notification.setEntreprise(facture.getEmploye().getEntreprise());
        notification.setCreatedBy(admin.getEmail());
        notification.setRead(false);
        notificationRepository.save(notification);

        for (ModuleEmploye module : modulesNonPayes) {
            module.setFacture(facture);
            facture.getModules().add(module);
            moduleEmployeRepo.save(module);
        }

        emailService.envoyerFactureParEmail(facture,modulesNonPayes.get(0).getEmploye().getEntreprise().getEmail());

        return facture;
    }
}
