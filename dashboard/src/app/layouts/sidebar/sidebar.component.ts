import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import MetisMenu from 'metismenujs';
import { EventService } from '../../core/services/event.service';
import { Router, NavigationEnd } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { TranslateService } from '@ngx-translate/core';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { EntrepriseSessionService } from 'src/app/core/services/entreprise-session.service';
import { EmployeSessionService } from 'src/app/core/services/employe-session.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef;
  @Input() isCondensed = false;
  menu: any;
  data: any;
  userType: string | null = '';
  userMail: string | null = '';
  errorMessage = '';
  menuItems: MenuItem[] = [];
  user: any;

  @ViewChild('sideMenu') sideMenu: ElementRef;

  constructor(private eventService: EventService, private router: Router,
              public translate: TranslateService,
              private http: HttpClient,private adminSessionService:AdminSessionService,
              private entrepriseService:EntrepriseService,private employeService:EmployeService,
              private entrepriseSessionService:EntrepriseSessionService,private employeSessionService:EmployeSessionService,
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
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
    this._scrollElement();
    this._activateMenuDropdown();


  }

  ngAfterViewInit() {
    this.menu = new MetisMenu(this.sideMenu.nativeElement);
    this._activateMenuDropdown();
  }

  toggleMenu(event) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }
  _scrollElement() {
    setTimeout(() => {
      if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition = document.getElementsByClassName("mm-active")[0]['offsetTop'];
        if (currentPosition > 500)
        if(this.scrollRef.SimpleBar !== null)
          this.scrollRef.SimpleBar.getScrollElement().scrollTop =
            currentPosition + 300;
      }
    }, 300);
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
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);
    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }
    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;
      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) { childAnchor.classList.add('mm-active'); }
            if (childDropdown) { childDropdown.classList.add('mm-active'); }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                parent5El.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') { childanchor.classList.add('mm-active'); }
              }
            }
          }
        }
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
  
  /*initialize(user:any): void {
    this.menuItems = MENU;
  }*/

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
