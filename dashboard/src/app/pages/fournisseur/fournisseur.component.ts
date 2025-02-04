import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { FournisseurService } from 'src/app/core/services/fournisseur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseurComponent {
  fournisseurs: any[] = [];
      addForm: FormGroup;
      editForm: FormGroup;
      selectedFournisseur: any; // pour stocker le module sélectionné pour l'édition
      p: number = 1; // Current page number
      itemsPerPage: number = 5;
      searchFournisseur: string = '';
      idFournisseur: number;
      user: any;
      userType: string | null = '';
      private errorMessage: string = '';
      crmPermissions: any;
    
      @ViewChild('add', { static: false }) add?: ModalDirective;
      @ViewChild('edit', { static: false }) edit?: ModalDirective;
    
      constructor(private fournisseurService: FournisseurService, private fb: FormBuilder,private entrepriseService: EntrepriseService,
            private employeService: EmployeService,
            private adminService: AdminSessionService,) {
        this.addForm = this.fb.group({
          label: ['', Validators.required],
          nom: ['', [Validators.required]],
          email: ['', [Validators.required]],
          adresse: ['', [Validators.required]],
          tel: ['', [Validators.required]],
        });
    
        this.editForm = this.fb.group({
          label: ['', Validators.required],
          nom: ['', [Validators.required]],
          email: ['', [Validators.required]],
          adresse: ['', [Validators.required]],
          tel: ['', [Validators.required]],
        });
   
      }
    
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
            this.getAllFournisseur(data.entreprise.id);
            this.crmPermissions = this.getCRMPermissions(data);
  if (this.crmPermissions) {
    console.log('CRM Permissions:', this.crmPermissions);
    // You can use these permissions to control UI elements or functionality
  } else {
    console.log('No CRM module found for this user.');
  }
          },
          (error) => {
            console.error('Error fetching worker data', error);
            this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
          }
        );
      }
    
      getAllFournisseur(idEnt:number): void {
        this.fournisseurService.getFournisseursByEntrepriseId(idEnt).subscribe(fournisseurs => {
          this.fournisseurs = fournisseurs;
        });
      }

      getCRMPermissions(user:any) {
        const crmModule = user.modules.find(module => module.module.nom === 'CRM');
        if (crmModule) {
          return {
            consulter: crmModule.consulter,
            modifier: crmModule.modifier,
            ajouter: crmModule.ajouter,
            supprimer: crmModule.supprimer
          };
        }
        return null; // or return default permissions if needed
      }
    
      addModal(): void {
        this.addForm.reset();
        this.add?.show();
      }
    
      onAddFournisseur(): void {
        if (this.addForm.valid) {
          this.fournisseurService.addFournisseur(this.addForm.value,this.user.entreprise.id,this.user.email).subscribe({
            next: () => {
              Swal.fire('Ajouté!', 'Le fournisseur a été ajouté.', 'success');
              this.getAllFournisseur(this.user.entreprise.id);
              this.add?.hide();
            },
            error: error => {
              console.error(error);
              Swal.fire('Erreur!', 'Une erreur est survenue lors de l\'ajout.', 'error');
            }
          });
        }
      }
    
      editModal(fournisseur: any): void {
          this.selectedFournisseur = fournisseur;
          this.editForm.patchValue({
            label: fournisseur.label,
          nom: fournisseur.nom,
          email: fournisseur.email,
          adresse: fournisseur.adresse,
          tel: fournisseur.tel,
          });
          this.edit?.show();
   
      }
    
      onUpdateModule(): void {
        if (this.editForm.valid) {
          const formValues = this.editForm.value;
          const fournisseurData = {
            label: formValues.label,
          nom: formValues.nom,
          email: formValues.email,
          adresse: formValues.adresse,
          tel: formValues.tel,
          };
          this.fournisseurService.updateFournisseur(this.selectedFournisseur.id, fournisseurData).subscribe({
            next: (response) => {
              console.log(response);
              Swal.fire('Modifié!', 'Le fournisseur a été modifié.', 'success');
              this.getAllFournisseur(this.user.entreprise.id);
              this.edit?.hide();
            },
            error: error => {
              console.error(error);
              Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
            }
          });
        }
      }
    
      deleteModule(fournisseurId: number): void {
        Swal.fire({
          title: 'Êtes-vous sûr?',
          text: 'Cette action ne peut pas être annulée!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, supprimer!',
          cancelButtonText: 'Annuler'
        }).then(result => {
          if (result.isConfirmed) {
            this.fournisseurService.deleteFournisseur(fournisseurId).subscribe({
              next: () => {
                Swal.fire('Supprimé!', 'Le fournisseur a été supprimé.', 'success');
                this.getAllFournisseur(this.user.entreprise.id);
              },
              error: error => {
                console.error(error);
                Swal.fire('Erreur!', 'Une erreur est survenue lors de la suppression.', 'error');
              }
            });
          }
        });
      }
    
      searchEmployeBy(): void {
        if (this.searchFournisseur.trim() === '') {
          this.getAllFournisseur(this.user.entreprise.id);
        } else {
          this.fournisseurs = this.fournisseurs.filter(n =>
            n.nom.toLowerCase().includes(this.searchFournisseur.toLowerCase()) || n.email.toLowerCase().includes(this.searchFournisseur.toLowerCase()) || n.label.toLowerCase().includes(this.searchFournisseur.toLowerCase()) || n.tel.toLowerCase().includes(this.searchFournisseur.toLowerCase())
          );
        }
      }

}
