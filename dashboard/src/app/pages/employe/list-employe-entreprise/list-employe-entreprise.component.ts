import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { ModuleService } from 'src/app/core/services/module.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-employe-entreprise',
  templateUrl: './list-employe-entreprise.component.html',
  styleUrls: ['./list-employe-entreprise.component.scss']
})
export class ListEmployeEntrepriseComponent {
    employes: any[] = [];
    p: number = 1; // Current page number
    itemsPerPage: number = 5; // Number of items per page
    user: any;
    userType: string | null = '';
    searchEmploye: string = '';
    modalRef?: BsModalRef;
    submitted = false;
    listmoduleAppTrue: any[] = [];
    listmoduleAppFalse: any[] = [];
    showAdditionalModules: boolean = false; // Flag to show additional modules
    addForm!: FormGroup;

    private errorMessage: string = '';

    @ViewChild('add', { static: false }) add?: ModalDirective;
    @ViewChild('edit', { static: false }) edit?: ModalDirective;

    constructor(
      private entrepriseService: EntrepriseService,
      private employeService: EmployeService,
      private adminService: AdminSessionService,
      private moduleService: ModuleService,
      private fb: FormBuilder
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

      this.moduleService.getAllModules().subscribe((res: any) => {
        this.listmoduleAppTrue = res.filter((module: any) => module.app === true);
        this.listmoduleAppFalse = res.filter((module: any) => module.app === false);
      });

      this.addForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        moduleIds: [[], Validators.required],
      });
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

  bloquer(id: number): void {
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
        this.employeService.updateEmployeStatus(id).subscribe({
          next: (data: any) => {
            if (data.status) {
              Swal.fire({
                title: 'Bloqué!',
                text: "Ce compte est bloqué.",
                icon: 'success',
              });
            } else {
              Swal.fire({
                title: 'Débloqué!',
                text: "Ce compte est débloqué.",
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

  addModal() {
    this.submitted = false;
    this.add?.show()
    
  }

  onModuleChange(selectedOptions: any): void {
    console.log(selectedOptions);
    const selectedModuleIds = Array.from(selectedOptions).map((option: any) => option.value.split(':')[1].trim());  // Supprimer les espaces autour des IDs
    console.log('Selected Module IDs:', selectedModuleIds);  // Afficher les IDs sélectionnés pour déboguer
    
    if (selectedModuleIds.includes('5')) {  // Vérifier si le CRM (ID 5) est sélectionné
      this.showAdditionalModules = true;  // Afficher les modules additionnels
      console.log('true');
    } else {
      this.showAdditionalModules = false; // Masquer les modules additionnels
      console.log('false');
    }
}



  onAddEmploye(): void {
    if (this.addForm.invalid) return;

    this.submitted = true;
    const formValues = this.addForm.value;
    const employeData = {
      email: formValues.email,
      password: formValues.password,
    };
    
    // Assure-toi que l'ID de l'entreprise est bien disponible
    const entrepriseId = this.user.id;

    // Envoi de la demande d'ajout d'employé avec les 3 arguments nécessaires
    this.employeService.addEmploye(employeData, entrepriseId, formValues.moduleIds).subscribe(
      (response) => {
        Swal.fire({
          title: 'Employé ajouté!',
          icon: 'success',
          text: 'L\'employé a été ajouté avec succès.',
        }).then(() => this.add?.hide());
      },
      (error) => {
        console.log(error);
        Swal.fire({
          title: 'Erreur!',
          icon: 'error',
          text: 'Une erreur est survenue lors de l\'ajout de l\'employé.',
        });
      }
    );
}

  
}
