import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeSessionService } from 'src/app/core/services/employe-session.service';
import { EntrepriseSessionService } from 'src/app/core/services/entreprise-session.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm: FormGroup;
  errorMessage = '';
  isSubmitting = false; // Ajouter cette ligne pour déclarer isSubmitting

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminsessionservice: AdminSessionService,
    private employesessionservice: EmployeSessionService,
    private entreprisesessionservice: EntrepriseSessionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      return;
    }

    // Mise à jour de la propriété isSubmitting pour désactiver le bouton pendant le traitement
    this.isSubmitting = true;
    const signInData = this.signInForm.value;
    this.authService.signIn(signInData).subscribe(
      (response) => {
        console.log('Sign in response', response);

        if (response.statusCode === 500 ) {
          this.errorMessage = 'Email ou mot de passe invalide. Veuillez réessayer.';
        } else {
          // Store tokens, userType, and other details in local storage
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('expirationTime', response.expirationTime);
          localStorage.setItem('userType', response.userType);

          // Extract user identifier from token
          const userMail = this.getUserIdentifierFromToken(response.token);
          localStorage.setItem('userMail', userMail);

          const userType = response.userType;

          // Determine user type and start the appropriate session
          if (userType === 'admin') {
            this.adminsessionservice.startSession(userMail).subscribe(
              (sessionResponse) => {
                localStorage.setItem('sessionId', sessionResponse.id); // Save session ID in localStorage
                this.router.navigate(['/signup']);
              },
              (error) => {
                this.errorMessage = 'Échec du démarrage de la session. Veuillez réessayer.';
              }
            );
          } 
          else if(userType === 'entreprise') {
            this.entreprisesessionservice.startSession(userMail).subscribe(
              (sessionResponse) => {
                localStorage.setItem('sessionId', sessionResponse.id); // Save session ID in localStorage
                this.router.navigate(['/employes']);
              },
              (error) => {
                this.errorMessage = 'Échec du démarrage de la session. Veuillez réessayer.';
              }
            );
          } else {
            this.employesessionservice.startSession(userMail).subscribe(
              (sessionResponse) => {
                localStorage.setItem('sessionId', sessionResponse.id); // Save session ID in localStorage
                this.router.navigate(['/signup']);
              },
              (error) => {
                this.errorMessage = 'Échec du démarrage de la session. Veuillez réessayer.';
              }
            );
          }
        }
      },
      (error) => {
        this.errorMessage = 'Échec de la connexion. Veuillez réessayer.';
      },
      () => {
        // Réinitialisation de la propriété isSubmitting après la fin de la demande
        this.isSubmitting = false;
      }
    );
  }

  private getUserIdentifierFromToken(token: string): string {
    // Decode JWT token to extract user identifier (sub field)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }
}
