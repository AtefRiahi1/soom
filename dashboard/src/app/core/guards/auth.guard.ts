import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable, of } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { EntrepriseSessionService } from '../services/entreprise-session.service'; 
import { EmployeSessionService } from '../services/employe-session.service'; 
import { AdminSessionService } from '../services/admin-session.service'; 

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private inactivityTimer: any;
    private inactivityDuration: number = 60 * 60 * 1000; 

    constructor(
        private router: Router,
        private entrepriseSessionService: EntrepriseSessionService,
        private employeSessionService: EmployeSessionService,
        private adminSessionService: AdminSessionService 
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const userType = localStorage.getItem('userType');
        const sessionId = localStorage.getItem('sessionId');

        return this.checkSessionActive(userType, sessionId).pipe(
            map(isActive => {
                if (!isActive) {
                    this.router.navigate(['/signin']);
                    return false;
                }

                // Vérifie si le token a expiré
                if (!this.checkTokenExpiration()) {
                    return false;
                }

                // Démarre ou réinitialise le timer d'inactivité
                this.startInactivityTimer();

                // Vérifie si le userType est valide
                return ['entreprise', 'employe', 'admin'].includes(userType || '');
            }),
            catchError(() => {
                this.router.navigate(['/signin']);
                return of(false);
            })
        );
    }

    checkTokenExpiration(): boolean {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1])); // Décodage du token
                const currentTime = Math.floor(Date.now() / 1000); // Temps actuel en secondes
                if (currentTime > tokenData.exp) {
                    this.logout();
                    return false;
                }
            } catch (error) {
                console.error('Erreur lors du décodage du token', error);
                this.router.navigate(['/signin']);
                return false;
            }
        } else {
            console.error('Token non trouvé.');
            this.router.navigate(['/signin']);
            return false;
        }

        return true;
    }

    logout() {
        const userType = localStorage.getItem('userType');
        const sessionId = localStorage.getItem('sessionId');

        let endSession: Observable<any>;

        if (userType === 'employe') {
            endSession = this.employeSessionService.endSession(Number(sessionId));
        } else if (userType === 'entreprise') {
            endSession = this.entrepriseSessionService.endSession(Number(sessionId));
        } else if (userType === 'admin') {
            endSession = this.adminSessionService.endSession(Number(sessionId));
        } else {
            this.clearLocalStorageAndRedirect();
            return;
        }

        endSession.subscribe(
            () => {
                console.log(`${userType} session terminée`);
                this.clearLocalStorageAndRedirect();
            },
            (error) => {
                console.error(`Échec lors de la fin de la session ${userType}`, error);
                this.clearLocalStorageAndRedirect();
            }
        );
    }

    clearLocalStorageAndRedirect() {
        localStorage.clear();
        this.router.navigate(['/signin']);
    }

    startInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }

        this.inactivityTimer = setTimeout(() => {
            this.logout();
        }, this.inactivityDuration);
    }

    checkSessionActive(userType: string | null, sessionId: string | null): Observable<boolean> {
        const id = Number(sessionId);

        if (userType === 'employe') {
            return this.employeSessionService.isSessionActive(id);
        } else if (userType === 'entreprise') {
            return this.entrepriseSessionService.isSessionActive(id);
        } else if (userType === 'admin') {
            return this.adminSessionService.isSessionActive(id); // Vérifie la session admin
        } else {
            this.clearLocalStorageAndRedirect();
            return of(false);
        }
    }
}
