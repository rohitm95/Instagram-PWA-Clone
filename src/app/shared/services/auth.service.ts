import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { scheduled, asyncScheduler } from 'rxjs';
import { AuthData } from '../auth-data.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  router = inject(Router);
  // provider = new GoogleAuthProvider();
  constructor() { }

  registerUser(authData: AuthData) {
    return scheduled(
      createUserWithEmailAndPassword(
        this.auth,
        authData.email,
        authData.password
      ),
      asyncScheduler
    );
  }

  login(authData: AuthData) {
    return scheduled(
      signInWithEmailAndPassword(this.auth, authData.email, authData.password),
      asyncScheduler
    );
  }

  logout() {
    window.localStorage.removeItem('token');
    signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // loginWithPopup() {
  //   return scheduled(signInWithPopup(this.auth, this.provider), asyncScheduler)
  // }
}
