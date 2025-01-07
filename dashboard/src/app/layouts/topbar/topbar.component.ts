import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

import { StompSubscription } from '@stomp/stompjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  private stompSubscription: StompSubscription;
  element: any;
  cookieValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  user: any;
  userType: string | null = '';
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
   
this.getUserTypeAndFetchProfile();


  }

  getUserTypeAndFetchProfile(): void {
    this.userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userMail');

    if (this.userType && userEmail) {
      this.checkTokenExpiration();

      if (this.userType === 'user') {

      } else if (this.userType === 'worker') {

      } else {
        this.errorMessage = 'Invalid user type.';
      }
    } else {
      this.errorMessage = 'User information not found in local storage.';
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

}
