import { Component, OnInit } from '@angular/core';
import { NotificationModels } from 'src/app/core/models/notification.model';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.scss']
})
export class ListNotificationComponent implements OnInit{
  notifications: NotificationModels[];
    p: number = 1; // Current page number
    itemsPerPage: number = 5; // Number of items per page
    user: any;
    userType: string | null = '';
    searchNotification: string = '';

    private errorMessage: string;


  constructor(private notificationService: NotificationService,
              private entrepriseService: EntrepriseService,
              private employeService: EmployeService,private adminService: AdminSessionService) { }

  ngOnInit(): void {

      this.userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userMail');

      if (this.userType && userEmail) {
          if (this.userType === 'admin') {
              this.fetchAdminProfile(userEmail);
          }else if (this.userType === 'entreprise') {
            this.fetchEntrepriseProfile(userEmail);
        } 
           else if (this.userType === 'employe') {
              this.fetchEmployeProfile(userEmail);
          } else {
              this.errorMessage = "Type d'utilisateur invalide.";
          }
      } else {
          this.errorMessage = 'Informations utilisateur introuvables dans le stockage local.';
      }
  }

  getNotifications(id:any): void {
    if (this.userType === 'admin') {
      this.notificationService.getNotificationsByAdminId(id).subscribe(
        notifications => this.notifications = notifications,
        error => console.log(error)
    );
  }else if (this.userType === 'entreprise') {
    this.notificationService.getNotificationsByEntrepriseId(id).subscribe(
      notifications => this.notifications = notifications,
      error => console.log(error)
  );
} 
   else {
    this.notificationService.getNotificationsByEmployeId(id).subscribe(
      notifications => this.notifications = notifications,
      error => console.log(error)
  );
  }
  }

  deleteNotification(notificationId: number): void {
    Swal.fire({
      title: 'Vous etes sure?',
      text: "Vous ne pouvez pas revenir en arriére!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui!',
    }).then((result) => {
      if (result.isConfirmed) {
    this.notificationService.deleteNotification(notificationId).subscribe(
        () => {
          // Remove the deleted notification from the array
          this.notifications = this.notifications.filter(notification => notification.id !== notificationId);
        },
        error => console.log(error)
    );
  }
});
  }

  markNotificationAsRead(notificationId: number): void {
    this.notificationService.markNotificationAsRead(notificationId).subscribe(
        () => {
          // Update the read status of the notification
          const notification = this.notifications.find(notification => notification.id === notificationId);
          if (notification) {
            notification.read = true;
          }
        },
        error => console.log(error)
    );
  }

    private fetchAdminProfile(email: string): void {
        this.adminService.getAdminByEmail(email).subscribe(
            (data) => {
                this.user = data;
                this.getNotifications(data.id)
            },
            (error) => {
                console.error('Error fetching user data', error);
                this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
            }
        );
    }

    private fetchEntrepriseProfile(email: string): void {
        this.entrepriseService.getEntrepriseByEmail(email).subscribe(
            (data) => {
                this.user = data;
                this.getNotifications(data.id)
            },
            (error) => {
                console.error('Error fetching worker data', error);
                this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
            }
        );
    }

    private fetchEmployeProfile(email: string): void {
      this.employeService.getEmployeByEmail(email).subscribe(
          (data) => {
              this.user = data;
              this.getNotifications(data.id)
          },
          (error) => {
              console.error('Error fetching worker data', error);
              this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
          }
      );
  }

    searchNotificationBy(): void {
        if (this.searchNotification.trim() === '') {
            this.getNotifications(this.user.id);
        } else {
            this.notifications = this.notifications.filter(n =>
                n.createdBy.toLowerCase().includes(this.searchNotification.toLowerCase())||
                n.title.toLowerCase().includes(this.searchNotification.toLowerCase())||
                n.message.toLowerCase().includes(this.searchNotification.toLowerCase())

            );
        }
    }

}
