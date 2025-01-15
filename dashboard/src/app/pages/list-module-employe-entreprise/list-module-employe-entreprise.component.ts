import { Component } from '@angular/core';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { ModuleEmployeService } from 'src/app/core/services/module-employe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-module-employe-entreprise',
  templateUrl: './list-module-employe-entreprise.component.html',
  styleUrls: ['./list-module-employe-entreprise.component.scss']
})
export class ListModuleEmployeEntrepriseComponent {

  modulesEmploye: any[] = [];
    p: number = 1; // Current page number
    itemsPerPage: number = 6; // Number of items per page
    user: any;
    userType: string | null = '';
    searchModuleEmploye: string = '';
    private errorMessage: string = '';
    employeList: any[] = [];
  
  
    constructor(
      private employeService: EmployeService,
      private adminService: AdminSessionService,
      private entrepriseService: EntrepriseService,
      private moduleEmployeServiec: ModuleEmployeService,

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
          this.getModuleEmploye(data.id);
          this.getEmployes(data.id);
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
  
    getModuleEmploye(id: any): void {
      this.moduleEmployeServiec.getModuleByEntrepriseId(id).subscribe(
        (employes) => this.modulesEmploye = employes,
        (error) => console.log(error)
      );
    }

    getEmployes(id: any): void {
      this.employeService.getEmployesByEntrepriseId(id).subscribe(
        (employes) => this.employeList = employes,
        (error) => console.log(error)
      );
    }
  
    searchEmployeBy(): void {
      if (this.searchModuleEmploye.trim() === '') {
        this.getModuleEmploye(this.user.id);
      } else {
        this.modulesEmploye = this.modulesEmploye.filter(n =>
          n.module.nom.toLowerCase().includes(this.searchModuleEmploye.toLowerCase())
        );
      }
    }

    updateResponsable(moduleEmployeId: number, empId: number): void {
      this.moduleEmployeServiec.updateModuleEmployeResponsable(moduleEmployeId, empId).subscribe(
          response => {
              console.log('Responsable mis à jour avec succès', response);
              Swal.fire({
                                title: 'Responsable Modifié!',
                                icon: 'success',
                                text: 'Responsable mis à jour avec succès.',
                              });
              // Vous pouvez ajouter une notification ou une logique pour rafraîchir les données ici
          },
          error => {
            Swal.fire({
                              title: 'Erreur!',
                              icon: 'error',
                              text: 'Une erreur est survenue lors de la mise à jour de reponsable.',
                            });
              console.error('Erreur lors de la mise à jour du responsable', error);
          }
      );
  }

}
