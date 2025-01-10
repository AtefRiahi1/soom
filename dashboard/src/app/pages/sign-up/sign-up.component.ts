import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit{

  signupForm: FormGroup;
  logoFile: File | null = null;
  logoUploadProgress: number = 0;
  logoUrl: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      tel: ['', [Validators.required, Validators.pattern(/^\d{8,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ENTREPRISE', Validators.required]
    });
  }

  ngOnInit(): void {}

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      this.uploadLogo();
    }
  }

  uploadLogo(): void {
    if (!this.logoFile) return;

    const username = this.signupForm.get('email')?.value; // Récupérer le username du formulaire

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

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement.';
      return;
    }

    if (!this.logoUrl) {
      this.errorMessage = 'Veuillez uploader un logo avant de soumettre.';
      return;
    }

    this.isSubmitting = true;
    const entreprise = { ...this.signupForm.value, logo: this.logoUrl };

    this.authService.signUp(entreprise).subscribe(
      (response) => {
        console.log('Inscription réussie :', response);
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/signin']); 
      },
      (error) => {
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Erreur lors de l\'inscription. Veuillez réessayer.',
          footer: "S'inscrire"
        });
        this.isSubmitting = false;
      }
    );
  }
}
