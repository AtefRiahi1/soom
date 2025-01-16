import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ModuleService } from 'src/app/core/services/module.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-module',
  templateUrl: './list-module.component.html',
  styleUrls: ['./list-module.component.scss']
})
export class ListModuleComponent {
  
  modules: any[] = [];
  addForm: FormGroup;
  editForm: FormGroup;
  selectedModule: any; // pour stocker le module sélectionné pour l'édition
  p: number = 1; // Current page number
  itemsPerPage: number = 5;
  searchModule: string = '';
  showPathField: boolean = false; // Pour le formulaire d'ajout
  showEditPathField: boolean = false; // Pour le formulaire d'édition
  idModule: number;

  @ViewChild('add', { static: false }) add?: ModalDirective;
  @ViewChild('edit', { static: false }) edit?: ModalDirective;

  constructor(private moduleService: ModuleService, private fb: FormBuilder) {
    this.addForm = this.fb.group({
      nom: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      app: [false], // Ajout de l'attribut app
      path: [''] // Ajout de l'attribut path
    });

    this.addForm.get('app')?.valueChanges.subscribe(value => {
      this.showPathField = value; // Met à jour la variable en fonction de la sélection
    });

    this.editForm = this.fb.group({
      nom: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      app: [false], // Ajout de l'attribut app
      path: [''] // Ajout de l'attribut path
    });

    this.editForm.get('app')?.valueChanges.subscribe(value => {
      this.showEditPathField = value; // Met à jour la variable en fonction de la sélection
    });
  }

  ngOnInit(): void {
    this.getAllModules();
  }

  getAllModules(): void {
    this.moduleService.getAllModules().subscribe(modules => {
      this.modules = modules;
    });
  }

  addModal(): void {
    this.addForm.reset();
    this.showPathField = false; 
    this.add?.show();
  }

  onAddModule(): void {
    if (this.addForm.valid) {
      this.moduleService.addModule(this.addForm.value).subscribe({
        next: () => {
          Swal.fire('Ajouté!', 'Le module a été ajouté.', 'success');
          this.getAllModules();
          this.add?.hide();
        },
        error: error => {
          console.error(error);
          Swal.fire('Erreur!', 'Une erreur est survenue lors de l\'ajout.', 'error');
        }
      });
    }
  }

  editModal(moduleId: number): void {
    this.idModule = moduleId;
    this.moduleService.getModuleById(moduleId).subscribe(module => {
      this.selectedModule = module;
      this.editForm.patchValue({
        nom: module.nom,
        prix: module.prix,
        app: module.app,
        path: module.path
      });
      this.showEditPathField = module.app; // Mettez à jour cette variable
      this.edit?.show();
    });
  }

  onUpdateModule(): void {
    if (this.editForm.valid) {
      const formValues = this.editForm.value;
      const moduleData = {
        nom: formValues.nom,
        prix: formValues.prix,
        app: formValues.app,
        path: formValues.path
      };
      console.log(this.idModule)
      console.log(moduleData)
      this.moduleService.updateModule(this.idModule, moduleData).subscribe({
        next: (response) => {
          console.log(response);
          Swal.fire('Modifié!', 'Le module a été modifié.', 'success');
          this.getAllModules();
          this.edit?.hide();
        },
        error: error => {
          console.error(error);
          Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
        }
      });
    }
  }

  deleteModule(moduleId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action ne peut pas être annulée!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.moduleService.deleteModule(moduleId).subscribe({
          next: () => {
            Swal.fire('Supprimé!', 'Le module a été supprimé.', 'success');
            this.getAllModules();
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
    if (this.searchModule.trim() === '') {
      this.getAllModules();
    } else {
      this.modules = this.modules.filter(n =>
        n.nom.toLowerCase().includes(this.searchModule.toLowerCase())
      );
    }
  }
}