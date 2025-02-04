import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { ClientService } from 'src/app/core/services/client.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {

  clients: any[] = [];
    addForm: FormGroup;
    editForm: FormGroup;
    selectedClient: any; // pour stocker le module sélectionné pour l'édition
    p: number = 1; // Current page number
    itemsPerPage: number = 5;
    searchClient: string = '';
    idClient: number;
    user: any;
    userType: string | null = '';
    private errorMessage: string = '';
    crmPermissions: any;
  
    @ViewChild('add', { static: false }) add?: ModalDirective;
    @ViewChild('edit', { static: false }) edit?: ModalDirective;
  
    constructor(private clientService: ClientService, private fb: FormBuilder,private entrepriseService: EntrepriseService,
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
          this.getAllClient(data.entreprise.id);
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
  
    getAllClient(idEnt:number): void {
      this.clientService.getClientsByEntrepriseId(idEnt).subscribe(clients => {
        this.clients = clients;
      });
    }
  
    addModal(): void {
      this.addForm.reset();
      this.add?.show();
    }
  
    onAddClient(): void {
      if (this.addForm.valid) {
        this.clientService.addClient(this.addForm.value,this.user.entreprise.id,this.user.email).subscribe({
          next: () => {
            Swal.fire('Ajouté!', 'Le client a été ajouté.', 'success');
            this.getAllClient(this.user.entreprise.id);
            this.add?.hide();
          },
          error: error => {
            console.error(error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de l\'ajout.', 'error');
          }
        });
      }
    }
  
    editModal(client: any): void {
        this.selectedClient = client;
        this.editForm.patchValue({
          label: client.label,
        nom: client.nom,
        email: client.email,
        adresse: client.adresse,
        tel: client.tel,
        });
        this.edit?.show();
 
    }
  
    onUpdateModule(): void {
      if (this.editForm.valid) {
        const formValues = this.editForm.value;
        const clientData = {
          label: formValues.label,
        nom: formValues.nom,
        email: formValues.email,
        adresse: formValues.adresse,
        tel: formValues.tel,
        };
        console.log(this.idClient)
        console.log(clientData)
        this.clientService.updateClient(this.selectedClient.id, clientData).subscribe({
          next: (response) => {
            console.log(response);
            Swal.fire('Modifié!', 'Le client a été modifié.', 'success');
            this.getAllClient(this.user.entreprise.id);
            this.edit?.hide();
          },
          error: error => {
            console.error(error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
          }
        });
      }
    }
  
    deleteModule(clientId: number): void {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Cette action ne peut pas être annulée!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      }).then(result => {
        if (result.isConfirmed) {
          this.clientService.deleteClient(clientId).subscribe({
            next: () => {
              Swal.fire('Supprimé!', 'Le client a été supprimé.', 'success');
              this.getAllClient(this.user.entreprise.id);
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
      if (this.searchClient.trim() === '') {
        this.getAllClient(this.user.entreprise.id);
      } else {
        this.clients = this.clients.filter(n =>
          n.nom.toLowerCase().includes(this.searchClient.toLowerCase()) || n.email.toLowerCase().includes(this.searchClient.toLowerCase()) || n.label.toLowerCase().includes(this.searchClient.toLowerCase()) || n.tel.toLowerCase().includes(this.searchClient.toLowerCase())
        );
      }
    }

}
