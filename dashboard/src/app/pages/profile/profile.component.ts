import { Component, OnInit } from '@angular/core';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  userType: string | null = '';
  errorMessage = '';

  constructor(
      private adminService: AdminSessionService,
      private entrepriseService: EntrepriseService,
      private employeService: EmployeService
  ) { }

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
      } 
      else {
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
        },
        (error) => {
          console.error('Error fetching user data', error);
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
          console.error('Error fetching user data', error);
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
        }
    );
  }

}
