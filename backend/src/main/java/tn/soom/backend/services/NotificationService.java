package tn.soom.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.entities.Notification;
import tn.soom.backend.repositories.AdminERPRepo;
import tn.soom.backend.repositories.EmployeRepo;
import tn.soom.backend.repositories.EntrepriseRepo;
import tn.soom.backend.repositories.NotificationRepo;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepo notificationRepository;
    @Autowired
    private AdminERPRepo adminERPRepository;
    @Autowired
    private EmployeRepo employeRepo;
    @Autowired
    private EntrepriseRepo entrepriseRepo;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByAdminId(Integer adminId) {
        AdminERP adminERP = adminERPRepository.findById(adminId).orElse(null);
        return adminERP != null ? notificationRepository.findByAdminERP(adminERP) : List.of();
    }

    public List<Notification> getNotificationsByEntrepriseId(Integer entId) {
        Entreprise entreprise = entrepriseRepo.findById(entId).orElse(null);
        return entreprise != null ? notificationRepository.findByEntreprise(entreprise) : List.of();
    }

    public List<Notification> getNotificationsByEmployeId(Integer employeId) {
        Employe employe = employeRepo.findById(employeId).orElse(null);
        return employe != null ? notificationRepository.findByEmploye(employe) : List.of();
    }

    public void deleteNotification(Integer notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public Notification markNotificationAsRead(Integer notificationId) {
        Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);

        if (notificationOptional.isPresent()) {
            Notification notification = notificationOptional.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }

        return null; // Or throw an exception indicating that the notification was not found
    }

    public Optional<Notification> getNotificationById(Integer notificationId) {
        return notificationRepository.findById(notificationId);
    }
}
