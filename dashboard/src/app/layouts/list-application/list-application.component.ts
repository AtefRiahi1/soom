import { Component } from '@angular/core';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { ModuleEmployeService } from 'src/app/core/services/module-employe.service';
import { ModuleService } from 'src/app/core/services/module.service';

@Component({
  selector: 'app-list-application',
  templateUrl: './list-application.component.html',
  styleUrls: ['./list-application.component.scss']
})
export class ListApplicationComponent {

  modules: any[] = [];
  p: number = 1; // Current page number
  itemsPerPage: number = 6;
  searchModule: string = '';
  user: any;
  userType: string | null = '';
  private errorMessage: string = '';

  constructor(private moduleService: ModuleEmployeService,private employeService: EmployeService,
      private adminService: AdminSessionService,
      private entrepriseService: EntrepriseService) { }

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
        this.getAllModules();
      },
      (error) => {
        console.error('Error fetching worker data', error);
        this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
      }
    );
  }

  getAllModules(): void {
    this.moduleService.getModuleEmpByEmpId(this.user.id).subscribe(modules => {
      // Filtrer pour ne garder que ceux avec app = true
      console.log(modules);
      this.modules = modules.filter(module => module.module.app === true && module.paye===true && module.status===true);
      console.log(this.modules);
    });
  }

  searchEmployeBy(): void {
    if (this.searchModule.trim() === '') {
      this.getAllModules(); // Récupérer les modules filtrés
    } else {
      this.modules = this.modules.filter(n =>
        n.module.nom.toLowerCase().includes(this.searchModule.toLowerCase())
      );
    }
  }

  openExternalApp(path: string): void {
    window.location.href = path; // Navigue vers l'URL externe dans la même fenêtre
}
}