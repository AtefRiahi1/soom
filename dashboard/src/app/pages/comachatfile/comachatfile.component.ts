import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { CommandeAchatService } from 'src/app/core/services/commande-achat.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';

@Component({
  selector: 'app-comachatfile',
  templateUrl: './comachatfile.component.html',
  styleUrls: ['./comachatfile.component.scss']
})
export class ComachatfileComponent {
  blobUrl: SafeResourceUrl | null = null;
  filename:string;
  ido:number;
  mimeType: string;
  order:any;
  user: any;
  userType: string | null = '';
  private errorMessage: string = '';

  constructor(private router: Router,private sanitizer: DomSanitizer, private actR: ActivatedRoute, private orderservice: CommandeAchatService,private entrepriseService: EntrepriseService,
      private employeService: EmployeService,
      private adminService: AdminSessionService) { }

  getParam() {
    this.actR.paramMap.subscribe(data => {this.filename = String(data.get('filename'));
      this.ido = Number(data.get('ido'));
    });
  }


ngOnInit() {
  this.getParam();
  console.log(this.filename);
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

download(user:any){
  this.orderservice.getCommandeAchatById(this.ido).subscribe((data:any)=>{
    this.orderservice.downloadFile(this.filename,user.email).subscribe(
      event => {
   
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );

  })
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
      this.download(data);
    },
    (error) => {
      console.error('Error fetching worker data', error);
      this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
    }
  );
}


private reportProgress(httpEvent: HttpEvent<string | Blob>) {
  switch (httpEvent.type) {
    case HttpEventType.Response:
      if (httpEvent.body instanceof Blob) {
        this.mimeType = httpEvent.headers.get('Content-Type') || 'application/octet-stream';
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(httpEvent.body)
        );
      } else {
        console.error('Invalid response body. Expected Blob, but received:', typeof httpEvent.body);
      }
      break;
    default:
      console.log(httpEvent);
  }
}

  viewBlob(blob: Blob) {
    this.blobUrl = URL.createObjectURL(blob);
  }


}
