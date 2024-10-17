import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { FormBuilder } from '@angular/forms';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceMock: any;
  let snackbarServiceMock: any;
  let spinnerServiceMock: any;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceMock = {
      registerUser: jasmine.createSpy().and.returnValue(of({})),
      logout: jasmine.createSpy(),
    };
    snackbarServiceMock = {
      showSnackbar: jasmine.createSpy(),
    };
    spinnerServiceMock = {
      showSpinner: jasmine.createSpy(),
    };
    await TestBed.configureTestingModule({
      imports: [SignupComponent, BrowserAnimationsModule],
      providers: [
        provideFirebaseApp(() =>
          initializeApp({
            projectId: 'pwagram-f89ff',
            appId: '1:660528663524:web:a52575ae1ed2cedae4d5f1',
            storageBucket: 'pwagram-f89ff.appspot.com',
            apiKey: 'AIzaSyDz8o2lJB6gfaHOrB_n2Cb3yxw8-0q_1D4',
            authDomain: 'pwagram-f89ff.firebaseapp.com',
            messagingSenderId: '660528663524',
            measurementId: 'G-GMS3Q333WQ',
          })
        ),
        provideAuth(() => getAuth()),
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login page when navigateToSignIn() is called', () => {
    component.navigateToSignIn();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should create the form on ngOnInit', () => {
    component.ngOnInit();

    expect(component.userSignupForm).toBeDefined();
    expect(component.userSignupForm.controls['email'].validator).toBeDefined();
    expect(
      component.userSignupForm.controls['password'].validator
    ).toBeDefined();
    expect(component.userSignupForm.controls['name'].validator).toBeDefined();
  });

  it('should signup a user successfully', (done) => {
    component.userSignupForm = new FormBuilder().group({
      email: ['test@example.com'],
      password: ['password123'],
      name: ['Test User'],
    });

    component.signup(component.userSignupForm);

    expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(true);
    expect(authServiceMock.registerUser).toHaveBeenCalledWith(
      component.userSignupForm.value
    );

    // Simulate successful response
    setTimeout(() => {
      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith(
        'User Created! Please login',
        null,
        3000
      );
      done();
    }, 0);
  });
});
