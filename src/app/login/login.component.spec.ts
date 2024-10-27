import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AuthService } from '../shared/services/auth.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let snackbarSpy: jasmine.SpyObj<SnackbarService>;
  let spinnerSpy: jasmine.SpyObj<SpinnerService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    snackbarSpy = jasmine.createSpyObj('SnackbarService', ['showSnackbar']);
    spinnerSpy = jasmine.createSpyObj('SpinnerService', ['showSpinner']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent, BrowserAnimationsModule],
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
        { provide: AuthService, useValue: authSpy },
        { provide: SnackbarService, useValue: snackbarSpy },
        { provide: SpinnerService, useValue: spinnerSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to signup page when navigateToSignUp() is called', () => {
    component.navigateToSignUp();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/signup']);
  });

  it('should initialize the form with two controls', () => {
    component.ngOnInit();
    expect(component.userLoginForm.contains('email')).toBeTrue();
    expect(component.userLoginForm.contains('password')).toBeTrue();
  });

  // it('should make login call with valid credentials', () => {
  //   component.ngOnInit();
  //   const mockResponse = { user: { getIdToken: () => Promise.resolve('mockToken') } };
  //   authSpy.login.and.returnValue(of(mockResponse));

  //   component.login(component.userLoginForm);
    
  //   expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(true);
  //   expect(authSpy.login).toHaveBeenCalledWith({
  //     email: '',
  //     password: '',
  //   });
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  //   expect(window.localStorage.getItem('token')).toBe(JSON.stringify('mockToken'));
  // });

  it('should handle login error with invalid credentials', () => {
    component.ngOnInit();
    authSpy.login.and.returnValue(throwError(() => new Error('Firebase: Error (auth/invalid-login-credentials).')));

    component.login(component.userLoginForm);

    expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(true);
    expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(false);
    expect(snackbarSpy.showSnackbar).toHaveBeenCalledWith('Invalid login credentials', null, 3000);
  });

  it('should handle generic login error', () => {
    component.ngOnInit();
    authSpy.login.and.returnValue(throwError(() => new Error('Some other error occurred.')));

    component.login(component.userLoginForm);

    expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(true);
    expect(spinnerSpy.showSpinner).toHaveBeenCalledWith(false);
    expect(snackbarSpy.showSnackbar).toHaveBeenCalledWith('Some other error occurred.', null, 3000);
  });
});
