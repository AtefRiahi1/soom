import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  userType: string | null = '';
  errorMessage = '';
  editForm: FormGroup;
  idEntreprise: number;
  logoFile: File | null = null;
  logoUploadProgress: number = 0;
  logoUrl: string = '';

  @ViewChild('edit', { static: false }) edit?: ModalDirective;
  constructor(
      private adminService: AdminSessionService,
      private entrepriseService: EntrepriseService,
      private fb: FormBuilder,
      private authService: AuthService,
      private employeService: EmployeService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],             
      email: ['', [Validators.required, Validators.email]], 
      address: ['', Validators.required],          
      tel: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]             
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
      } 
      else {
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
          console.error('Error fetching user data', error);
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
          console.error('Error fetching user data', error);
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
        }
    );
  }

  editModal(entrepriseId: number): void {
    this.idEntreprise = entrepriseId;

      this.editForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: this.user.address,
        tel: this.user.tel
      });
      this.edit?.show();
  }

  onUpdateProfile(): void {

    if (!this.logoUrl) {
      this.errorMessage = 'Veuillez uploader un logo avant de soumettre.';
      Swal.fire('Erreur!', 'Veuillez uploader un logo avant de soumettre.', 'error');
      return;
    }

    const entreprise = { ...this.editForm.value, logo: this.logoUrl };

      if (this.editForm.valid) {
        

        this.entrepriseService.updateEntreprise(this.idEntreprise, entreprise).subscribe({
          next: (response) => {
            console.log(response);
            Swal.fire('Modifié!', 'Le profile a été modifié.', 'success');
            this.edit?.hide();
          },
          error: error => {
            console.error(error);
            Swal.fire('Erreur!', 'Une erreur est survenue lors de la modification.', 'error');
          }
        });
      }
    }

    onFileSelect(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.logoFile = file;
        this.uploadLogo();
      }
    }

    uploadLogo(): void {
        if (!this.logoFile) return;
    
        const username = this.editForm.get('email')?.value;
    
        const formData = new FormData();
        formData.append('file', this.logoFile);
        formData.append('username', username); // Ajouter le username au FormData
    
        // Appel du service pour uploader le fichier avec le username
        this.authService.uploadFile(this.logoFile, username).subscribe(
          (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.logoUploadProgress = Math.round((100 * event.loaded) / (event.total || 1));
            } else if (event instanceof HttpResponse) {
              this.logoUrl = event.body || '';
              this.logoUploadProgress = 100; // Upload complet
            }
          },
          (error) => {
            this.errorMessage = 'Erreur lors de l\'upload du logo';
            console.error(error);
          }
        );
      }

}
