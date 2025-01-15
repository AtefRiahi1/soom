import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-entreprise',
  templateUrl: './list-entreprise.component.html',
  styleUrls: ['./list-entreprise.component.scss']
})
export class ListEntrepriseComponent {

  entreprises: any[] = [];
      p: number = 1; // Current page number
      itemsPerPage: number = 5; // Number of items per page
      user: any;
      userType: string | null = '';
      searchEntreprise: string = '';
  currentEmployeId: number | null = null;
  
      private errorMessage: string = '';
      logoUrl: string | null = null;
  
      constructor(
        private entrepriseService: EntrepriseService,
        private employeService: EmployeService,
        private adminService: AdminSessionService,
        private authService:AuthService,
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
    }
  
    private fetchAdminProfile(email: string): void {
      this.adminService.getAdminByEmail(email).subscribe(
        (data) => {
          this.user = data;
          this.getEntreprises();
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
        },
        (error) => {
          console.error('Error fetching worker data', error);
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
        }
      );
    }
  
    getEntreprises(): void {
      this.entrepriseService.getAllEntreprises().subscribe(
          (entreprises) => {
              this.entreprises = entreprises;
              // Téléchargez le logo pour chaque entreprise
              this.entreprises.forEach(entreprise => {
                  this.downloadFile(entreprise.logo, entreprise.email); // Assurez-vous que `logoFileName` est défini dans votre API
              });
          },
          (error) => console.log(error)
      );
  }
  
    searchEntrepriseBy(): void {
      if (this.searchEntreprise.trim() === '') {
        this.getEntreprises();
      } else {
        this.entreprises = this.entreprises.filter(n =>
          n.email.toLowerCase().includes(this.searchEntreprise.toLowerCase()) || n.tel.toLowerCase().includes(this.searchEntreprise.toLowerCase()) || n.name.toLowerCase().includes(this.searchEntreprise.toLowerCase())
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
          this.entrepriseService.updateEntrepriseStatus(id).subscribe({
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

    downloadFile(fileName: string,email:string): void {
        this.authService.downloadFile(fileName, email).subscribe(
          (event) => {
            if (event.type === HttpEventType.Response) {
              const blob = event.body as Blob;
              const objectUrl = URL.createObjectURL(blob);
              this.logoUrl = objectUrl; // Assign the URL to the logoUrl
            }
          },
          (error) => {
            console.error('Error downloading file:', error);
          }
        );
      }

}
