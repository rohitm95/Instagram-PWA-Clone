import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { FeedComponent } from './feed.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../shared/services/auth.service';
import { MessagingService } from '../shared/services/messaging.service';
import { from, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let authServiceMock: any;
  let messagingServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      logout: jasmine.createSpy(),
    };

    messagingServiceMock = {
      getDeviceToken: jasmine.createSpy('getDeviceToken').and.returnValue(of('mockToken')),
      listenForMessages: jasmine.createSpy('listenForMessages'),
    };

    const activatedRouteMock = {
      params: from([{ id: '123' }]),
    };

    await TestBed.configureTestingModule({
      imports: [FeedComponent, BrowserAnimationsModule],
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
        { provide: MessagingService, useValue: messagingServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and get device token on ngOnInit', () => {
    expect(messagingServiceMock.getDeviceToken).toHaveBeenCalled();
    expect(messagingServiceMock.listenForMessages).toHaveBeenCalled();
  });

  it('should call logout method', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should log device token when retrieved successfully', () => {
    spyOn(console, 'log');
    component.ngOnInit();
    expect(console.log).toHaveBeenCalledWith('mockToken');
  });

  it('should handle token retrieval error', () => {
    spyOn(console, 'log');
    messagingServiceMock.getDeviceToken.and.returnValue(throwError(() => new Error('Error')));
    component['_getDeviceToken']();
    expect(console.log).toHaveBeenCalledWith('Token error', jasmine.any(Error));
  });

  it('should handle message reception', () => {
    component['_onMessage']();
    expect(messagingServiceMock.listenForMessages).toHaveBeenCalled();
  });
});
