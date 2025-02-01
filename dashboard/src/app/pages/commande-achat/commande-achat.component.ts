import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { CommandeAchatService } from 'src/app/core/services/commande-achat.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { FournisseurService } from 'src/app/core/services/fournisseur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-commande-achat',
  templateUrl: './commande-achat.component.html',
  styleUrls: ['./commande-achat.component.scss']
})
export class CommandeAchatComponent {
  commandes: any[] = [];
  fournisseurs: any[] = [];
  addForm: FormGroup;
  editForm: FormGroup;
  idFournisseur:number
  selectedCommande: any; // pour stocker le module sélectionné pour l'édition
  p: number = 1; // Current page number
  itemsPerPage: number = 5;
  searchArticle: string = '';
  user: any;
  userType: string | null = '';
  private errorMessage: string = '';

  @ViewChild('add', { static: false }) add?: ModalDirective;
  @ViewChild('edit', { static: false }) edit?: ModalDirective;

  constructor(
    private commandeService: CommandeAchatService,
    private fb: FormBuilder,
    private entrepriseService: EntrepriseService,
    private employeService: EmployeService,
    private adminService: AdminSessionService,
    private fournisseurService: FournisseurService
  ) {
    this.addForm = this.fb.group({
      numCommande: ['', Validators.required],
      produits: this.fb.array([]),
      idFournisseur: [null, Validators.required], 
      priceHt: [{ value: 0, disabled: true }],
      tva: [0, Validators.required],
      taxe: [{ value: 0, disabled: true }],
      netApayer: [{ value: 0, disabled: true }],
      deliveryDate: [null],
    });

    this.editForm = this.fb.group({
      numCommande: ['', Validators.required],
      produits: this.fb.array([]),
      idFournisseur: [null, Validators.required], 
      priceHt: [{ value: 0, disabled: true }],
      tva: [0, Validators.required],
      taxe: [{ value: 0, disabled: true }],
      netApayer: [{ value: 0, disabled: true }],
      deliveryDate: [null],
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
        this.getAllCommande(data.entreprise.id);
        this.getAllfournisseur(data.entreprise.id);
      },
      (error) => {
        console.error('Error fetching worker data', error);
        this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
      }
    );
  }

  getAllCommande(idEnt: number): void {
    this.commandeService.getCommandesByEntrepriseId(idEnt).subscribe(commandes => {
      this.commandes = commandes;
    });
  }

  getAllfournisseur(idEnt: number): void {
    this.fournisseurService.getFournisseursByEntrepriseId(idEnt).subscribe(fournisseurs => {
      this.fournisseurs = fournisseurs;
    });
  }

  addModal(): void {
    this.addForm.reset();
    this.addForm.setControl('produits', this.fb.array([]));
    this.addProduct(); // Start with one product entry
    this.add?.show();
  }

  addProduct(): void {
    const productForm = this.fb.group({
      nom: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prixUnitaire: [0, [Validators.required, Validators.min(0)]],
      prix_total: [{ value: 0, disabled: true }],
    });
    (this.addForm.get('produits') as FormArray).push(productForm);
  }

  removeProduct(index: number): void {
    (this.addForm.get('produits') as FormArray).removeAt(index);
  }

  onAddCommande(): void {
    if (this.addForm.valid) {
      const formData = { ...this.addForm.value };
      // Convert deliveryDate to LocalDateTime format
      const date = new Date(formData.deliveryDate);
      formData.deliveryDate = date.toISOString(); // This will produce a string like "2025-02-22T00:00:00.000Z"
  
      this.commandeService.createCommandeAchat(formData, this.user.entreprise.id, this.addForm.value.idFournisseur, this.user.email).subscribe({
        next: () => {
          Swal.fire('Ajouté!', "La commande a été ajoutée.", 'success');
          this.getAllCommande(this.user.entreprise.id);
          this.add?.hide();
        },
        error: error => {
          console.error(error);
          Swal.fire('Erreur!', 'Une erreur est survenue lors de l\'ajout.', 'error');
        }
      });
    }
  }

  editModal(commande: any): void {
    this.selectedCommande = commande;
    this.editForm.patchValue({
      numCommande: commande.numCommande,
      tva: commande.tva,
      deliveryDate: commande.deliveryDate
    });
    // Reset and populate products
    const produitsArray = this.editForm.get('produits') as FormArray;
    produitsArray.clear();
    commande.produits.forEach((prod: any) => {
      produitsArray.push(this.fb.group({
        nom: [prod.nom, Validators.required],
        quantite: [prod.quantite, [Validators.required, Validators.min(1)]],
        prixUnitaire: [prod.prixUnitaire, [Validators.required, Validators.min(0)]],
        prix_total: [{ value: prod.prix_total, disabled: true }],
      }));
    });
    this.edit?.show();
  }

  onUpdateCommande(): void {
    if (this.editForm.valid) {
      const formValues = this.editForm.value;

      this.commandeService.updateCommandeAchat(this.selectedCommande.id, formValues, this.user.email).subscribe({
        next: () => {
          Swal.fire('Modifié!', "La commande a été modifiée.", 'success');
          this.getAllCommande(this.user.entreprise.id);
          this.edit?.hide();
        },
        error: error => {
          console.error(error);
          Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
        }
      });
    }
  }

  deleteModule(commandeId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action ne peut pas être annulée!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.commandeService.deleteCommandeAchat(commandeId).subscribe({
          next: () => {
            Swal.fire('Supprimé!', "La commande a été supprimée.", 'success');
            this.getAllCommande(this.user.entreprise.id);
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
    if (this.searchArticle.trim() === '') {
      this.getAllCommande(this.user.entreprise.id);
    } else {
      this.commandes = this.commandes.filter(n =>
        n.numCommande.toLowerCase().includes(this.searchArticle.toLowerCase())
      );
    }
  }
}