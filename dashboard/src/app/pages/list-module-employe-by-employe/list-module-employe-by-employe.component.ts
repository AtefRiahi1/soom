import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { ModuleEmployeService } from 'src/app/core/services/module-employe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-module-employe-by-employe',
  templateUrl: './list-module-employe-by-employe.component.html',
  styleUrls: ['./list-module-employe-by-employe.component.scss']
})
export class ListModuleEmployeByEmployeComponent {
  modulesEmploye: any[] = [];
  p: number = 1; // Current page number
  itemsPerPage: number = 6; // Number of items per page
  user: any;
  userType: string | null = '';
  searchModuleEmploye: string = '';
  private errorMessage: string = '';
  modalRef?: BsModalRef;
  idemp: number;
  selectedModule: any;

  @ViewChild('edit', { static: false }) edit?: ModalDirective;

  constructor(
    private employeService: EmployeService,
    private adminService: AdminSessionService,
    private entrepriseService: EntrepriseService,
    private moduleEmployeServiec: ModuleEmployeService,
    private actR: ActivatedRoute
  ) {}

  getParam() {
    this.actR.paramMap.subscribe(data => {
      this.idemp = Number(data.get('idemp'));
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
        this.getModuleEmploye(this.idemp);
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
        this.getModuleEmploye(this.idemp);
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
    this.moduleEmployeServiec.getModuleEmpByEmpId(id).subscribe(
      (employes) => this.modulesEmploye = employes,
      (error) => console.log(error)
    );
  }

  searchEmployeBy(): void {
    if (this.searchModuleEmploye.trim() === '') {
      this.getModuleEmploye(this.idemp);
    } else {
      this.modulesEmploye = this.modulesEmploye.filter(n =>
        n.module.nom.toLowerCase().includes(this.searchModuleEmploye.toLowerCase())
      );
    }
  }

  editModal(moduleId: number): void {
    this.selectedModule = this.modulesEmploye.find((e) => e.id === moduleId);
    this.edit?.show(); // Ouvre le modal
  }

  // Méthode pour mettre à jour les permissions (non implémentée pour le moment)
  updatePermissions(): void {
    if (this.selectedModule) {
      this.moduleEmployeServiec.updateModuleEmployePermissions(
        this.selectedModule.id,
        this.selectedModule.consulter,
        this.selectedModule.modifier,
        this.selectedModule.ajouter,
        this.selectedModule.supprimer
      ).subscribe(
        response => {
          Swal.fire({
                  title: 'Permissions mises à jour!',
                  icon: 'success',
                  text: 'Les permissions de l\'employé ont été mises à jour avec succès.',
                }).then(() => {this.edit?.hide();location.reload();});
        },
        error => {
          console.error('Erreur lors de la mise à jour des permissions', error);
          Swal.fire({
                  title: 'Erreur!',
                  icon: 'error',
                  text: 'Une erreur est survenue lors de la mise à jour des permissions.',
                });
        }
      );
    }
  }
}