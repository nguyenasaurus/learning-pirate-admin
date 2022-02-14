import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private router: Router, private afAuth: Auth) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user: any) => {
        if (user) {
          // if (!user.emailVerified)                            // if the user hasn't verified their email, send them to that page
          //     this.router.navigate(['/verify-email']);

          resolve(true);
        } else {
          console.log('Auth Guard: user is not logged in');

          this.router.navigate(['/sign-in'], {
            queryParams: { returnUrl: state.url },
          });

          resolve(false);
        }
      });
    });
  }
}
