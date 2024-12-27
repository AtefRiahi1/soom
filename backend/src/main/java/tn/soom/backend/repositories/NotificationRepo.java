package tn.soom.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.soom.backend.entities.AdminERP;
import tn.soom.backend.entities.Employe;
import tn.soom.backend.entities.Entreprise;
import tn.soom.backend.entities.Notification;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Integer> {
    List<Notification> findByEmploye(Employe employe);

    List<Notification> findByAdminERP(AdminERP adminERP);
    List<Notification> findByEntreprise(Entreprise entreprise);
}
