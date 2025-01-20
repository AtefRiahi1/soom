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
    editForm!: FormGroup;
currentEmployeId: number | null = null;

selectedModule: number | null = null; // Modifier pour permettre null
  recommendedModules: any[] = [];
  moduleMap: { [key: number]: string } = {};

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
        res.forEach((module: any) => {
          this.moduleMap[module.id] = module.nom; // Associé l'ID au nom du module
        });
      });

      this.addForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        moduleIds: [[], Validators.required],
      });
      this.editForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        moduleIds: [[]],
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


  onSubmit() {
    if (!this.selectedModule) {
      Swal.fire({
        title: 'Erreur!',
        text: 'Veuillez sélectionner un module avant de demander des recommandations.',
        icon: 'error'
      });
      return;
    }
  
    this.entrepriseService.getRecommendedModules(this.selectedModule)
      .subscribe(modules => {
        this.recommendedModules = modules;
  
        // Récupérer les noms des modules correspondants
        const moduleNames = this.recommendedModules.map((id: number) => this.moduleMap[id]);
        console.log('Noms des modules recommandés:', moduleNames); // Pour le débogage
      }, error => {
        console.error('Erreur lors de la récupération des modules recommandés:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur est survenue lors de la récupération des modules recommandés.',
          icon: 'error'
        });
      });
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
            if (!data.status) {
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
    console.log('Selected Module IDs:', selectedModuleIds);  // Afficher les IDs sélectionnés pour 
    this.selectedModule = selectedModuleIds.length > 0 ? selectedModuleIds[0] : null;
    
    if (selectedModuleIds.includes('1')) {  // Vérifier si le CRM (ID 5) est sélectionné
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
        }).then(() =>{ this.add?.hide();location.reload();});
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

editModal(employeId: number): void {
  console.log('Employe ID:', employeId);
  this.currentEmployeId = employeId;

  const employe = this.employes.find((e) => e.id === employeId);

  if (employe) {
    // Pré-remplir le formulaire avec les données de l'employé, y compris les modules associés
    this.editForm.patchValue({
      email: employe.email,
      password: employe.password,
      moduleIds: employe.modules
        .filter((module: any) => module.status) // Filtrer pour ne garder que les modules avec status true
        .map((module: any) => module.module.id) // Associer les modules
    });
    this.edit?.show();
  }
}

onUpdateEmploye(): void {
  if (this.editForm.invalid) return;

  const formValues = this.editForm.value;
  const employeData = {
    email: formValues.email,
    password: formValues.password,
  };
  
  // Trouver l'employé courant
  const employe = this.employes.find((e) => e.id === this.currentEmployeId);
  
  // Modules à ajouter : ceux qui ne sont pas associés ou ceux qui sont associés mais avec status false
  const addModuleIds = formValues.moduleIds.filter(id => {
    const existingModule = employe.modules.find((m: any) => m.module.id === id);
    return !existingModule || (existingModule && !existingModule.status);
  });

  // Modules à supprimer : ceux qui sont associés mais non sélectionnés
  const removeModuleIds = employe.modules
    .filter((m: any) => !formValues.moduleIds.includes(m.module.id))
    .map((m: any) => m.module.id);

  // Appel au service pour mettre à jour l'employé
  this.employeService.manageEmployeData(employe.id, employeData, addModuleIds, removeModuleIds).subscribe(
    (response) => {
      Swal.fire({
        title: 'Employé mis à jour!',
        icon: 'success',
        text: 'Les informations de l\'employé ont été mises à jour avec succès.',
      }).then(() => {this.edit?.hide();location.reload();});
    },
    (error) => {
      console.error(error);
      Swal.fire({
        title: 'Erreur!',
        icon: 'error',
        text: 'Une erreur est survenue lors de la mise à jour de l\'employé.',
      });
    }
  );
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
