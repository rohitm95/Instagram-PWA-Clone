import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, Auth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let authMock: any;
  let routerMock: any;

  beforeEach(() => {
    authMock = {
      createUserWithEmailAndPassword: jasmine.createSpy().and.returnValue(of({})),
      signInWithEmailAndPassword: jasmine.createSpy().and.returnValue(of({})),
      signOut: jasmine.createSpy(),
    };

    routerMock = {
      navigate: jasmine.createSpy(),
    };
    TestBed.configureTestingModule({
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
        { provide: Auth, useValue: authMock },
        { provide: Router, useValue: routerMock },
        provideAuth(() => getAuth()),
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', (done) => {
    const authData = { email: 'test1@example.com', password: 'password123' };
    service.registerUser(authData).subscribe(() => {
      expect(authMock.createUserWithEmailAndPassword).toHaveBeenCalledWith(authMock, authData.email, authData.password);
      done();
    });
  });

  it('should log in a user', (done) => {
    const authData = { email: 'test@example.com', password: 'password123' };
    service.login(authData).subscribe(() => {
      expect(authMock.signInWithEmailAndPassword).toHaveBeenCalledWith(authMock, authData.email, authData.password);
      done();
    });
  });

  it('should log out a user and navigate to login', () => {
    service.logout();
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(authMock.signOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
