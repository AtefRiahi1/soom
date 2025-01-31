import { Component } from '@angular/core';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { MouvementService } from 'src/app/core/services/mouvement.service';

@Component({
  selector: 'app-mouvement',
  templateUrl: './mouvement.component.html',
  styleUrls: ['./mouvement.component.scss']
})
export class MouvementComponent {

  mouvements: any[] = [];
      p: number = 1; // Current page number
      itemsPerPage: number = 5; // Number of items per page
      user: any;
      userType: string | null = '';
      searchEmploye: string = '';
    

  
      private errorMessage: string = '';

  
      constructor(
        private entrepriseService: EntrepriseService,
        private employeService: EmployeService,
        private adminService: AdminSessionService,
        private mouvementService: MouvementService,
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
          this.getMouvements(data.id);
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
  
  
  
  
  
    getMouvements(id: any): void {
      this.mouvementService.getMouvementsByEntrepriseId(id).subscribe(
        (mouvements) => this.mouvements = mouvements,
        (error) => console.log(error)
      );
    }
  
    searchEmployeBy(): void {
      if (this.searchEmploye.trim() === '') {
        this.getMouvements(this.user.id);
      } else {
        this.mouvements = this.mouvements.filter(n =>
          n.nomProduit.toLowerCase().includes(this.searchEmploye.toLowerCase()) || n.type.toLowerCase().includes(this.searchEmploye.toLowerCase())
        );
      }
    }
  


}
