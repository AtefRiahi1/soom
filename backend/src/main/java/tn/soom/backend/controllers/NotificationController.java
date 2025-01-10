package tn.soom.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.soom.backend.entities.Notification;
import tn.soom.backend.services.NotificationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<Notification>> getNotificationsByAdminId(@PathVariable Integer adminId) {
        List<Notification> notifications = notificationService.getNotificationsByAdminId(adminId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Notification>> getNotificationsByEntrepriseId(@PathVariable Integer entrepriseId) {
        List<Notification> notifications = notificationService.getNotificationsByEntrepriseId(entrepriseId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/employe/{employeId}")
    public ResponseEntity<List<Notification>> getNotificationsByEmployeId(@PathVariable Integer employeId) {
        List<Notification> notifications = notificationService.getNotificationsByEmployeId(employeId);
        return ResponseEntity.ok(notifications);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Integer notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Integer notificationId) {
        Notification updatedNotification = notificationService.markNotificationAsRead(notificationId);

        if (updatedNotification != null) {
            return ResponseEntity.ok(updatedNotification);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Integer notificationId) {
        Optional<Notification> notification = notificationService.getNotificationById(notificationId);
        return notification.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
