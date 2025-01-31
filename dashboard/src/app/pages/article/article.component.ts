import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { ArticleService } from 'src/app/core/services/article.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {

  articles: any[] = [];
    addForm: FormGroup;
    editForm: FormGroup;
    selectedArticle: any; // pour stocker le module sélectionné pour l'édition
    p: number = 1; // Current page number
    itemsPerPage: number = 5;
    searchArticle: string = '';
    idArticle: number;
    user: any;
    userType: string | null = '';
    private errorMessage: string = '';
  
    @ViewChild('add', { static: false }) add?: ModalDirective;
    @ViewChild('edit', { static: false }) edit?: ModalDirective;
  
    constructor(private articleService: ArticleService, private fb: FormBuilder,private entrepriseService: EntrepriseService,
                private employeService: EmployeService,
                private adminService: AdminSessionService,) {
      this.addForm = this.fb.group({
        nom: ['', Validators.required],
        quantite: [0, [Validators.required]],
      });
  
      this.editForm = this.fb.group({
        nom: ['', Validators.required],
        quantite: [0, [Validators.required]],
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
          this.getAllArticles(data.entreprise.id);
        },
        (error) => {
          console.error('Error fetching worker data', error);
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
        }
      );
    }
  
    getAllArticles(idEnt:number): void {
      this.articleService.getArticlesByEntrepriseId(idEnt).subscribe(articles => {
        this.articles = articles;
      });
    }
  
    addModal(): void {
      this.addForm.reset();
      this.add?.show();
    }
  
    onAddModule(): void {
      if (this.addForm.valid) {
        this.articleService.addArticle(this.addForm.value,this.user.entreprise.id,this.user.email).subscribe({
          next: () => {
            Swal.fire('Ajouté!', "L'article a été ajouté.", 'success');
            this.getAllArticles(this.user.entreprise.id);
            this.add?.hide();
          },
          error: error => {
            console.error(error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de l\'ajout.', 'error');
          }
        });
      }
    }
  
    editModal(article: any): void {
      this.selectedArticle = article;
          this.editForm.patchValue({
            nom: article.nom,
          quantite: article.quantite,
          });
          this.edit?.show();
    }
  
    onUpdateArticle(): void {
      if (this.editForm.valid) {
        const formValues = this.editForm.value;
        const articleData = {
          nom: formValues.nom,
          quantite: formValues.quantite
        };
        this.articleService.updateArticle(this.selectedArticle.id, articleData).subscribe({
          next: (response) => {
            console.log(response);
            Swal.fire('Modifié!', "L'article a été modifié.", 'success');
            this.getAllArticles(this.user.entreprise.id);
            this.edit?.hide();
          },
          error: error => {
            console.error(error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
          }
        });
      }
    }
  
    deleteModule(articleId: number): void {
      Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Cette action ne peut pas être annulée!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler'
      }).then(result => {
        if (result.isConfirmed) {
          this.articleService.deleteArticle(articleId).subscribe({
            next: () => {
              Swal.fire('Supprimé!', "L'article a été supprimé.", 'success');
              this.getAllArticles(this.user.entreprise.id);
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
        this.getAllArticles(this.user.entreprise.id);
      } else {
        this.articles = this.articles.filter(n =>
          n.nom.toLowerCase().includes(this.searchArticle.toLowerCase())
        );
      }
    }

}
