import { Component, inject } from '@angular/core';
import { Auth, updateProfile } from '@angular/fire/auth';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatToolbarModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  userSignupForm: FormGroup;
  hide = true;
  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  snackbarService = inject(SnackbarService);
  auth = inject(Auth);
  subscription: Subscription;
  spinnerService = inject(SpinnerService);

  ngOnInit(): void {
    this.userSignupForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  get controls() {
    return this.userSignupForm.controls;
  }

  navigateToSignIn() {
    this.router.navigate(['/login']);
  }

  signup(formvalue: FormGroup) {
    this.spinnerService.showSpinner.next(true);
    this.authService.registerUser(formvalue.value).subscribe({
      next: (response) => {
        this.authService.logout();
        this.snackbarService.showSnackbar(
          'User Created! Please login',
          null,
          3000
        );
        updateProfile(this.auth.currentUser, {
          displayName: formvalue.value.name,
          photoURL:
            'https://firebasestorage.googleapis.com/v0/b/pwagram-f89ff.appspot.com/o/images/default-profile-pic.png?alt=media&token=18eb4938-dfbf-416a-86ee-d3d44a8a9dc3',
        }).catch((err) => console.log(err));
      },
      error: (error) => {
        this.snackbarService.showSnackbar(error.message, null, 3000);
      },
    });
  }

  updateProfile(formvalue: FormGroup) {
    updateProfile(this.auth.currentUser, {
      displayName: formvalue.value.name,
      photoURL:
        'https://firebase.googleapis.com/v0/b/to-do-app-3569d.appspot.com/o/default-profile-pic.png?alt=media&token=09a77c81-9576-438c-8c35-a74119a26103',
    }).catch((err) => console.log(err));
    this.router.navigate(['/posts']);
  }
}
