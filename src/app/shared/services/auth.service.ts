import { inject, Injectable } from '@angular/core';
import { scheduled, asyncScheduler } from 'rxjs';
import { AuthData } from '../auth-data.model';
import { Router } from '@angular/router';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  router = inject(Router);
  constructor() {}

  registerUser(authData: AuthData) {
    return scheduled(
      this.firebaseAuthService.createUser(authData.email, authData.password),
      asyncScheduler
    );
  }

  login(authData: AuthData) {
    return scheduled(
      this.firebaseAuthService.signIn(authData.email, authData.password),
      asyncScheduler
    );
  }

  logout() {
    globalThis.localStorage.removeItem('token');
    this.firebaseAuthService.signOut();
    this.router.navigate(['/login']);
  }

  // loginWithPopup() {
  //   return scheduled(signInWithPopup(this.auth, this.provider), asyncScheduler)
  // }
}
