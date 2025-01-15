import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { ModuleService } from 'src/app/core/services/module.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-employe-admin',
  templateUrl: './list-employe-admin.component.html',
  styleUrls: ['./list-employe-admin.component.scss']
})
export class ListEmployeAdminComponent {
  ident: number;
  employes: any[] = [];
    p: number = 1; // Current page number
    itemsPerPage: number = 5; // Number of items per page
    user: any;
    userType: string | null = '';
    searchEmploye: string = '';
    currentEmployeId: number | null = null;

    private errorMessage: string = '';

  constructor(
      private employeService: EmployeService,
      private adminService: AdminSessionService,
      private entrepriseService: EntrepriseService,
      private moduleService: ModuleService,
      private actR: ActivatedRoute
    ) {}

    getParam() {
      this.actR.paramMap.subscribe(data => {
        this.ident = Number(data.get('ident'));
      });
    }
    ngOnInit(): void {
      this.getParam();
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
            this.getEmployes(this.ident);
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
    
      getEmployes(id: any): void {
        this.employeService.getEmployesByEntrepriseId(id).subscribe(
          (employes) => this.employes = employes,
          (error) => console.log(error)
        );
      }

      searchEmployeBy(): void {
        if (this.searchEmploye.trim() === '') {
          this.getEmployes(this.user.id);
        } else {
          this.employes = this.employes.filter(n =>
            n.email.toLowerCase().includes(this.searchEmploye.toLowerCase())
          );
        }
      }

      verif(id: number): void {
        Swal.fire({
          title: 'Vous êtes sûr(e) ?',
          text: "Vous ne pourrez pas revenir en arrière !",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.employeService.updateEmployeVerif(id).subscribe({
              next: (data: any) => {
                if (data.status) {
                  Swal.fire({
                    title: 'Vérifié!',
                    text: "Ce compte est vérifié.",
                    icon: 'success',
                  });
                } else {
                  Swal.fire({
                    title: 'En attente!',
                    text: "Ce compte est en attente.",
                    icon: 'success',
                  });
                }
                location.reload();
              },
              error: (err) => {
                console.log(err);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Une erreur est survenue!',
                });
              }
            });
          }
        });
      }
    

}
