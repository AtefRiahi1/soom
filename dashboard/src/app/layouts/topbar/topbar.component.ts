import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

import { StompSubscription } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { AdminSessionService } from 'src/app/core/services/admin-session.service';
import { EntrepriseSessionService } from 'src/app/core/services/entreprise-session.service';
import { EmployeSessionService } from 'src/app/core/services/employe-session.service';
import { EntrepriseService } from 'src/app/core/services/entreprise.service';
import { EmployeService } from 'src/app/core/services/employe.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationModels } from 'src/app/core/models/notification.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  private stompSubscription: StompSubscription;
  element: any;
  notifications: NotificationModels[] = [];
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  user: any;
  userType: string | null = '';
  logoUrl: string | null = null;
  errorMessage = '';
  notification: { message: string; type: string; time: string }[] = [];
  sessionId = localStorage.getItem('sessionId');
  token = localStorage.getItem('token');
  unreadCount: number;


  constructor(
      @Inject(DOCUMENT) private document: any,
      private router: Router,

      public languageService: LanguageService,
      public translate: TranslateService,
      private adminSessionService:AdminSessionService,
      private entrepriseSessionService:EntrepriseSessionService,
      private employeSessionService:EmployeSessionService,
      private entrepriseService:EntrepriseService,
      private employeService:EmployeService,
      private notificationService :NotificationService,
      private authService:AuthService,
      public _cookiesService: CookieService,

  ) { }

  listLang: any = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    
    this.openMobileMenu = false;
    this.element = document.documentElement;


    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

    const userType = localStorage.getItem('userType');
    const sessionId = localStorage.getItem('sessionId');
    this.checkSessionActive(userType,sessionId);
this.getUserTypeAndFetchProfile();


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

  getUserTypeAndFetchProfile(): void {
    this.userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userMail');

    if (this.userType && userEmail) {
      this.checkTokenExpiration();

      if (this.userType === 'admin') {
        this.fetchAdminProfile(userEmail);

      }else if (this.userType === 'entreprise') {
        this.fetchEntrepriseProfile(userEmail);

      }
       else if (this.userType === 'employe') {
        this.fetchEmployeProfile(userEmail);

      } else {
        this.errorMessage = "Type d'utilisateur invalide.";
      }
    } else {
      this.errorMessage = 'Informations utilisateur introuvables dans le stockage local.';
    }
  }
 /* ngOnDestroy(): void {
    if (this.stompSubscription) {
      this.webSocketService.unsubscribe(this.stompSubscription);
    }
  }*/

 /* private subscribeToNotifications() {
    if (this.userType === 'user' && this.user) {
      this.stompSubscription = this.webSocketService.subscribe(`/topic/notifications/user/${this.user.id}`, (notification: NotificationModels) => {
        this.notifications.push(notification);
      });
    } else if (this.userType === 'worker' && this.user) {
      this.stompSubscription = this.webSocketService.subscribe(`/topic/notifications/worker/${this.user.id}`, (notification: NotificationModels) => {
        this.notifications.push(notification);
      });
    } else {
      this.stompSubscription = this.webSocketService.subscribe('/topic/notifications', (notification: NotificationModels) => {
        this.notifications.push(notification);
      });
    }
  }*/

    private fetchAdminProfile(email: string): void {
      this.adminSessionService.getAdminByEmail(email).subscribe(
          (data) => {
            this.user = data;
            this.loadAdminNotifications(this.user.id);
            this.downloadFile("images.png",data.email);
           // this.subscribeToNotifications();
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
            this.loadEntrepriseNotifications(this.user.id)
            this.downloadFile(data.logo,data.email);
           // this.subscribeToNotifications();
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
            this.loadEmployeNotifications(this.user.id);
            this.downloadFile(data.entreprise.logo,data.entreprise.email);
           // this.subscribeToNotifications();
          },
          (error) => {
            console.error('Error fetching user data', error);
            this.errorMessage = 'Erreur lors de la récupération des données utilisateur. Veuillez réessayer plus tard.';
          }
      );
    }


  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  logout() {
    const userType = localStorage.getItem('userType');

    if (userType === 'admin') {
      this.adminSessionService.endSession(Number(this.sessionId)).subscribe(
          (response) => {
            console.log('Worker session ended', response);
            localStorage.clear();
            this.router.navigate(['/signin']);
          },
          (error) => {
            console.error('Failed to end worker session', error);
            this.router.navigate(['/signin']);
          }
      );
    }else if (userType === 'entreprise') {
      this.entrepriseSessionService.endSession(Number(this.sessionId)).subscribe(
          (response) => {
            console.log('User session ended', response);
            localStorage.clear();
            this.router.navigate(['/signin']);
          },
          (error) => {
            console.error('Failed to end user session', error);
            this.router.navigate(['/signin']);
          }
      );
    } 
     else if (userType === 'employe') {
      this.employeSessionService.endSession(Number(this.sessionId)).subscribe(
          (response) => {
            console.log('User session ended', response);
            localStorage.clear();
            this.router.navigate(['/signin']);
          },
          (error) => {
            console.error('Failed to end user session', error);
            this.router.navigate(['/signin']);
          }
      );
    } else {
      localStorage.clear();
      this.router.navigate(['/signin']);
    }
  }



  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
        !document.fullscreenElement && !this.element.mozFullScreenElement &&
        !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
      }
    }
  }

  loadAdminNotifications(id: any): void {
    this.notificationService.getNotificationsByAdminId(id).subscribe(
        (notifications) => {
          // Get the current date and the date from three months ago
          const now = new Date();
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);

          // Filter notifications from the last 3 months
          const recentNotifications = notifications.filter(notification => {
            const notificationDate = new Date(notification.createdAt); // Assurez-vous que createdAt est un format de date valide
            return notificationDate >= threeMonthsAgo;
          });

          // Sort notifications to have unread ones on top
          this.notifications = recentNotifications.sort((a, b) => {
            // First, sort by read status
            if (a.read === b.read) {
              // If both have the same read status, sort by createdAt date
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
            }
            return a.read ? 1 : -1; // Unread notifications come first
          });

          // Optionally, you can reverse the order if you want the latest notifications first
          // this.notifications.reverse();

          this.updateUnreadCount();
        },
        (error) => {
          console.log("Error loading worker notifications:", error);
        }
    );
  }

  loadEntrepriseNotifications(id: any): void {
    this.notificationService.getNotificationsByEntrepriseId(id).subscribe(
        (notifications) => {
          // Get the current date and the date from three months ago
          const now = new Date();
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);

          // Filter notifications from the last 3 months
          const recentNotifications = notifications.filter(notification => {
            const notificationDate = new Date(notification.createdAt); // Assurez-vous que createdAt est un format de date valide
            return notificationDate >= threeMonthsAgo;
          });

          // Sort notifications to have unread ones on top
          this.notifications = recentNotifications.sort((a, b) => {
            // First, sort by read status
            if (a.read === b.read) {
              // If both have the same read status, sort by createdAt date
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
            }
            return a.read ? 1 : -1; // Unread notifications come first
          });

          // Optionally, you can reverse the order if you want the latest notifications first
          // this.notifications.reverse();

          this.updateUnreadCount();
        },
        (error) => {
          console.log("Error loading worker notifications:", error);
        }
    );
  }

  loadEmployeNotifications(id: any): void {
    this.notificationService.getNotificationsByEmployeId(id).subscribe(
        (notifications) => {
          // Get the current date and the date from three months ago
          const now = new Date();
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);

          // Filter notifications from the last 3 months
          const recentNotifications = notifications.filter(notification => {
            const notificationDate = new Date(notification.createdAt); // Assurez-vous que createdAt est un format de date valide
            return notificationDate >= threeMonthsAgo;
          });

          // Sort notifications to have unread ones on top
          this.notifications = recentNotifications.sort((a, b) => {
            // First, sort by read status
            if (a.read === b.read) {
              // If both have the same read status, sort by createdAt date
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
            }
            return a.read ? 1 : -1; // Unread notifications come first
          });

          // Optionally, you can reverse the order if you want the latest notifications first
          // this.notifications.reverse();

          this.updateUnreadCount();
        },
        (error) => {
          console.log("Error loading worker notifications:", error);
        }
    );
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(notification => !notification.read).length;
  }

  markAsRead(notification: NotificationModels): void {
    this.notificationService
        .markNotificationAsRead(notification.id)
        .subscribe((updatedNotification) => {
          notification.read = updatedNotification.read;
        });
  }



  getTimeAgo(timestamp: string): string {
    const currentTime = new Date().getTime();
    const notificationTime = new Date(timestamp).getTime();
    const timeDifference = currentTime - notificationTime;

    // Calculate the time in various units
    const minutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
      return weeks === 1 ? "1w" : `${weeks}w`;
    } else if (days > 0) {
      return days === 1 ? "1d" : `${days}d`;
    } else if (hours > 0) {
      return hours === 1 ? "1h" : `${hours}h`;
    } else {
      return minutes <= 1 ? "just now" : `${minutes}m`;
    }
  }

  // Assuming you have a method like this in your component

  checkTokenExpiration() {
    const token = localStorage.getItem('token');

    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1])); // Decoding the token
      // Check if the token has an expiry time
      if (tokenData && tokenData.exp) {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        // Compare the current time with the expiry time
        if (currentTime > tokenData.exp) {
          // Token has expired, initiate logout
          
        }
      } else {
        console.error('Token does not contain an expiry time.');
      }
    } else {
      console.error('Token not found.');

    }
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
    } else if (userType === 'entreprise') {
      this.entrepriseSessionService.isSessionActive(id).subscribe((isActive: boolean) => {
        if(isActive==false){
          localStorage.clear();
          this.router.navigateByUrl('/signin');
        }
      });
    }else if (userType === 'employe') {
      this.employeSessionService.isSessionActive(id).subscribe((isActive: boolean) => {
        if(isActive==false){
          localStorage.clear();
          this.router.navigateByUrl('/signin');
        }
      });
    }
     else {
      localStorage.clear();
      this.router.navigateByUrl('/signin');
    }
  }

}
