import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { from, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ScreenObserverService } from '../services/screen-observer-service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let screenObserverSpy: jasmine.SpyObj<ScreenObserverService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let screenObserverMock: jasmine.SpyObj<ScreenObserverService>;

  beforeEach(async () => {
    const activatedRouteMock = {
      params: from([{ id: '123' }]), // Mocking route parameters
      // You can add other properties like 'data', 'queryParams', etc. as needed
    };
    screenObserverSpy = jasmine.createSpyObj('ScreenObserverService', [
      'observe',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
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
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock, // Provide the mock
        },
        { provide: ScreenObserverService, useValue: screenObserverSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    screenObserverMock = TestBed.inject(
      ScreenObserverService
    ) as jasmine.SpyObj<ScreenObserverService>;
    screenObserverMock.observe.and.returnValue(
      of({
        matches: false,
        breakpoints: {
          xs: false,
          sm: false,
          md: false,
          lg: false,
          xl: false,
        },
      })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sidenav event on toggleSideNav call', () => {
    spyOn(component.sidenav, 'emit');
    component.toggleSideNav();
    expect(component.sidenav.emit).toHaveBeenCalled();
  });

  it('should call logout method of AuthService on logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
