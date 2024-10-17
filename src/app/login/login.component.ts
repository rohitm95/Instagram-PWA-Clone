import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userLoginForm: FormGroup;
  hide = true;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  spinnerService = inject(SpinnerService);
  subscription: Subscription;
  snackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.userLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.spinnerService.showSpinner(false);
  }

  get controls() {
    return this.userLoginForm.controls;
  }

  login(formData: FormGroup) {
    this.spinnerService.showSpinner(true);
    this.authService
      .login({
        email: formData.value.email,
        password: formData.value.password,
      })
      .subscribe({
        next: (response) => {
          const user = response.user;
          user.getIdToken().then((token) => {
            this.router.navigate(['/posts']);
            window.localStorage.setItem('token', JSON.stringify(token));
          });
        },
        error: (error) => {
          if (
            error.message ===
            'Firebase: Error (auth/invalid-login-credentials).'
          ) {
            this.spinnerService.showSpinner(false);
            this.snackbarService.showSnackbar(
              'Invalid login credentials',
              null,
              3000
            );
            this.spinnerService.showSpinner(false);
          } else {
            this.spinnerService.showSpinner(false);
            this.snackbarService.showSnackbar(error.message, null, 3000);
          }
        },
      });
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  // loginWithGoogle() {
  //   this.authService.loginWithPopup().subscribe((result) => {
  //     const user = result.user;
  //     user.getIdToken().then((token) => {
  //       window.localStorage.setItem('token', JSON.stringify(token));
  //     });
  //     this.checkUser(user);
  //   });
  // }

  // async checkUser(user) {
  //   const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
  //   console.log(userDoc.data())
  //   if (userDoc.exists()) {
  //     this.router.navigate(['/posts']);
  //   } else {
  //     let newUser = {
  //       userId: user.uid,
  //     };
  //     await setDoc(doc(this.firestore, 'users', user.uid), user.uid);
  //     this.router.navigate(['/signup']);
  //   }
  // }
}
