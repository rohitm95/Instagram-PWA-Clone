import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { FirebaseAuthService } from './firebase-auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let firebaseAuthServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    firebaseAuthServiceMock = {
      createUser: jasmine.createSpy('createUser').and.returnValue(Promise.resolve({})),
      signIn: jasmine.createSpy('signIn').and.returnValue(Promise.resolve({})),
      signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve()),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: FirebaseAuthService, useValue: firebaseAuthServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', (done) => {
    const authData = { email: 'test2@example.com', password: 'password123' };
    service.registerUser(authData).subscribe(() => {
      expect(firebaseAuthServiceMock.createUser).toHaveBeenCalledWith(authData.email, authData.password);
      done();
    });
  });

  it('should log in a user', (done) => {
    const authData = { email: 'test@example.com', password: 'password123' };
    service.login(authData).subscribe(() => {
      expect(firebaseAuthServiceMock.signIn).toHaveBeenCalledWith(authData.email, authData.password);
      done();
    });
  });

  it('should log out a user and navigate to login', () => {
    spyOn(globalThis.localStorage, 'removeItem');
    service.logout();
    expect(globalThis.localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(firebaseAuthServiceMock.signOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
