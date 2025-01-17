import { Component } from '@angular/core';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeSessionService } from 'src/app/core/services/employe-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-list-session-employe',
  templateUrl: './list-session-employe.component.html',
  styleUrls: ['./list-session-employe.component.scss']
})
export class ListSessionEmployeComponent {

  sessionemployes: any[] = [];
  p: number = 1; // Current page number
  itemsPerPage: number = 6; // Number of items per page
  user: any;
  userType: string | null = '';
  searchSessionEmploye: string = '';
  private errorMessage: string = '';

  constructor(
      private employeService: EmployeService,
      private adminService: AdminSessionService,
      private entrepriseService: EntrepriseService,
      private employesessionService:EmployeSessionService
    ) {}

    ngOnInit(): void {
      this.userType = localStorage.getItem('userType');
      const userEmail = localStorage.getItem('userMail');
  
      if (this.userType && userEmail) {
        if (this.userType === 'admin') {
          this.fetchAdminProfile(userEmail);
        } else if (this.userType === 'entreprise') {
          this.fetchEntrepriseProfile(userEmail);
        } else if (this.userType === 'employe') {
          this.fetchEmployeProfile(userEmail);
        } else {
          this.errorMessage = "Type d'utilisateur invalide.";
        }
      } else {
        this.errorMessage = 'Informations utilisateur introuvables dans le stockage local.';
      }
    }

    private fetchAdminProfile(email: string): void {
      this.adminService.getAdminByEmail(email).subscribe(
        (data) => {
          this.user = data;
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
          this.getSessionEmploye(data.id);
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
        },
        (error) => {
          console.error('Error fetching worker data', error);
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
        }
      );
    }

    getSessionEmploye(id: any): void {
      this.employesessionService.getAllEmployeSessions(id).subscribe(
        (employes) => {
          this.sessionemployes = employes.sort((a, b) => {
            if (a.sessionEnd === null && b.sessionEnd === null) {
              return 0; // If both sessionEnd are null, maintain original order
            } else if (a.sessionEnd === null) {
              return -1; // If a's sessionEnd is null, move it to the beginning
            } else if (b.sessionEnd === null) {
              return 1; // If b's sessionEnd is null, move it to the beginning
            } else {
              return 0; // If both sessionEnd are not null, maintain original order
            }
          });
        },
        (error) => console.log(error)
      );
    }

    endSession(userSessionId: string): void {
      Swal.fire({
        title: 'Fin de session',
        text: 'Êtes-vous sûr de vouloir mettre fin à cette session ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, finissons-en !',
        cancelButtonText: 'Non, garde-le'
      }).then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          this.employesessionService.endSession(Number(userSessionId))
              .subscribe(
                  () => {
                    Swal.fire('Session terminée !', 'La session est terminée.', 'success');
                    this.getSessionEmploye(this.user.id);
                  },
                  error => {
                    console.error('Error ending session', error);
                    this.showErrorMessage('Error ending session. Please try again later.');
                  }
              );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Annulé', "La session n'était pas terminée.", 'error');
        }
      });
    }

    private showErrorMessage(message: string): void {
      this.errorMessage = message;
    }
  
    searchEmployeBy(): void {
      if (this.searchSessionEmploye.trim() === '') {
        this.getSessionEmploye(this.user.id);
      } else {
        this.sessionemployes = this.sessionemployes.filter(n =>
          n.employeemail.toLowerCase().includes(this.searchSessionEmploye.toLowerCase())
        );
      }
    }

}
