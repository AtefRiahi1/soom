import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';

import { EventService } from '../../core/services/event.service';


import { DOCUMENT } from '@angular/common';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { environment } from '../../../environments/environment';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseSessionService } from 'src/app/core/services/entreprise-session.service';
import { EmployeSessionService } from 'src/app/core/services/employe-session.service';


@Component({
  selector: 'app-horizontaltopbar',
  templateUrl: './horizontaltopbar.component.html',
  styleUrls: ['./horizontaltopbar.component.scss']
})

/**
 * Horizontal Topbar and navbar specified
 */
export class HorizontaltopbarComponent implements OnInit, AfterViewInit {

  element:any;
  cookieValue:any;
  flagvalue:any;
  countryName:any;
  valueset:any;
  userType: string | null = '';
  userMail: string | null = '';
  errorMessage = '';
  menuItems: MenuItem[] = [];
  user: any;

  listLang:any = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  // tslint:disable-next-line: max-line-length
  constructor(@Inject(DOCUMENT) private document: any, private router: Router, private eventService: EventService,
    public languageService: LanguageService, 
    // tslint:disable-next-line: variable-name
    public _cookiesService: CookieService,private adminSessionService:AdminSessionService,
                  private entrepriseService:EntrepriseService,private employeService:EmployeService,
                  private entrepriseSessionService:EntrepriseSessionService,private employeSessionService:EmployeSessionService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activateMenu();
      }
    });
  }

  ngOnInit() {


    this.userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userMail');

    const userType = localStorage.getItem('userType');
    const sessionId = localStorage.getItem('sessionId');
    this.checkSessionActive(userType,sessionId);


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
  /*  this.initialize(this.user);
    console.log(this.user)*/


  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Logout the user
   */
  logout() {
   /* if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else {
      this.authFackservice.logout();
    }*/
    this.router.navigate(['/account/login']);
  }

  /**
   * On menu click
   */
  onMenuClick(event) {
    const nextEl = event.target.nextElementSibling;
    if (nextEl) {
      const parentEl = event.target.parentNode;
      if (parentEl) {
        parentEl.classList.remove("show");
      }
      nextEl.classList.toggle("show");
    }
    return false;
  }

  ngAfterViewInit() {
    this.activateMenu();
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Togglemenu bar
   */
  toggleMenubar() {
    const element = document.getElementById('topnav-menu-content');
    element.classList.toggle('show');
  }

  /**
   * Activates the menu
   */
  private activateMenu() {

    const resetParent = (el: any) => {
      const parent = el.parentElement;
      if (parent) {
        parent.classList.remove('active');
        const parent2 = parent.parentElement;
        this._removeAllClass('mm-active');
        this._removeAllClass('mm-show');
        if (parent2) {
          parent2.classList.remove('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.remove('active');
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove('active');
                const menuelement = document.getElementById("topnav-menu-content")
                if (menuelement !== null) {
                  if (menuelement.classList.contains('show'))
                    document
                      .getElementById("topnav-menu-content")
                      .classList.remove("show");
                }
              }
            }
          }
        }
      }
    };

    // activate menu item based on location
    const links = document.getElementsByClassName('side-nav-link-ref');
    let matchingMenuItem = null;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // reset menu
      resetParent(links[i]);
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
      if (location.pathname === links[i]['pathname']) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      const parent = matchingMenuItem.parentElement;
      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add('active');
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.add('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.add('active');
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.add('active');
                const parent6 = parent5.parentElement;
                if (parent6) {
                  parent6.classList.add('active');
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  /**
   * Initialize
   */
  initialize(userAuthorities: string[]): void {
      console.log(userAuthorities)
      if (userAuthorities && userAuthorities.length > 0) {
        console.log(userAuthorities)
        this.menuItems = MENU.filter(item => {
          // Vérifiez si l'élément du menu est destiné à au moins une des autorités de l'utilisateur
          return (
            !item.roles || item.roles.some(role => userAuthorities.includes(role))
          );
        });
      } else {
        // Si aucune autorité n'est fournie, affichez tous les éléments de menu
        this.menuItems = MENU;
      }
    }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  private fetchAdminProfile(email: string): void {
    this.adminSessionService.getAdminByEmail(email).subscribe(
      (data) => {
        this.user = data;
        console.log(this.user.role);
        const authorities = this.user.authorities.map((auth: any) => auth.authority);
        this.initialize(authorities); // Convert to array for consistency
      },
      (error) => {
        console.error('Error fetching user data', error);
        this.errorMessage = "Erreur lors de la récupération des données d'administrateur. Veuillez réessayer plus tard.";
      }
    );
  }
  
  private fetchEntrepriseProfile(email: string): void {
    this.entrepriseService.getEntrepriseByEmail(email).subscribe(
      (data) => {
        this.user = data;
        console.log(this.user.role);
        const authorities = this.user.authorities.map((auth: any) => auth.authority);
        this.initialize(authorities); // Convert to array for consistency
      },
      (error) => {
        console.error('Error fetching user data', error);
        this.errorMessage = "Erreur lors de la récupération des données de l'entreprise. Veuillez réessayer plus tard.";
      }
    );
  }
  
  private fetchEmployeProfile(email: string): void {
    this.employeService.getEmployeByEmail(email).subscribe(
      (data) => {
        this.user = data;
        console.log(this.user.role);
        const authorities = this.user.authorities.map((auth: any) => auth.authority); // Extract all authorities
        this.initialize(authorities);
      },
      (error) => {
        console.error('Error fetching user data', error);
        this.errorMessage = "Erreur lors de la récupération des données de l'employé. Veuillez réessayer plus tard.";
      }
    );
  }
  

  checkSessionActive(userType: string, sessionId: string): void {
    const id = Number(sessionId);

    if (userType === 'admin') {
      this.adminSessionService.isSessionActive(id).subscribe((isActive: boolean) => {
        if(isActive==false){
          localStorage.clear();
          this.router.navigateByUrl('/signin');
        }
      });
    }else if (userType === 'entreprise') {
      this.entrepriseSessionService.isSessionActive(id).subscribe((isActive: boolean) => {
        if(isActive==false){
          localStorage.clear();
          this.router.navigateByUrl('/signin');
        }
      });
    }
     else if (userType === 'employe') {
      this.employeSessionService.isSessionActive(id).subscribe((isActive: boolean) => {
        if(isActive==false){
          localStorage.clear();
          this.router.navigateByUrl('/signin');
        }
      });
    } else {
      localStorage.clear();
      this.router.navigateByUrl('/signin');
    }
  }


  

}