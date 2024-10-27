import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedComponent } from './feed.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../shared/services/auth.service';
import { getMessaging, getToken, Messaging, onMessage, provideMessaging } from '@angular/fire/messaging';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let authServiceMock: any;
  let messagingMock: any;

  beforeEach(async () => {
    authServiceMock = {
      logout: jasmine.createSpy(),
    };

    messagingMock = {
      // Mocking the methods we will use
    };
    const activatedRouteMock = {
      params: from([{ id: '123' }]), // Mocking route parameters
      // You can add other properties like 'data', 'queryParams', etc. as needed
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
        // await isSupported()
        provideAuth(() => getAuth()),
        provideMessaging(() => getMessaging()),
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock, // Provide the mock
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
    const getTokenSpy = spyOn(messagingMock, 'getToken').and.returnValue(Promise.resolve('mockToken'));
    const onMessageSpy = spyOn(messagingMock, 'onMessage').and.callFake((_, { next }) => {
      next({ message: 'Test message' });
    });

    component.ngOnInit();

    expect(getTokenSpy).toHaveBeenCalled();
    expect(onMessageSpy).toHaveBeenCalled();
  });

  it('should call logout method', () => {
    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should handle token retrieval error', (done) => {
    const consoleLogSpy = spyOn(console, 'log');
    spyOn(messagingMock, 'getToken').and.returnValue(Promise.reject('Token error'));

    component['_getDeviceToken']();

    setTimeout(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Token error', 'Token error');
      done();
    }, 0);
  });

  it('should handle message reception', () => {
    const consoleLogSpy = spyOn(console, 'log');
    const onMessageSpy = spyOn(messagingMock, 'onMessage').and.callFake((_, { next }) => {
      next({ message: 'Test message' });
    });

    component['_onMessage']();

    expect(consoleLogSpy).toHaveBeenCalledWith('Message', { message: 'Test message' });
    expect(consoleLogSpy).toHaveBeenCalledWith('Done listening to messages');
  });

  it('should handle message error', () => {
    const consoleLogSpy = spyOn(console, 'log');
    const onMessageSpy = spyOn(messagingMock, 'onMessage').and.callFake((_, { error }) => {
      error('Message error');
    });

    component['_onMessage']();

    expect(consoleLogSpy).toHaveBeenCalledWith('Message error', 'Message error');
  });
});
