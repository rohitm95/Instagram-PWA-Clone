import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CreatePostComponent } from './create-post.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { getAuth, provideAuth } from '@angular/fire/auth';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let dataServiceMock: any;
  let snackbarServiceMock: any;
  let routerMock: any;
  let spinnerServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    dataServiceMock = {
      uploadFile: jasmine.createSpy().and.returnValue(Promise.resolve('mockImageURL')),
      addPostToDatabase: jasmine.createSpy().and.returnValue(of({})),
    };

    snackbarServiceMock = {
      showSnackbar: jasmine.createSpy(),
    };

    routerMock = {
      navigate: jasmine.createSpy(),
    };

    activatedRouteMock = {
      snapshot: {
        params: {
          id: 'testId',
        },
      },
    };

    spinnerServiceMock = {
      showSpinner: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [CreatePostComponent, ReactiveFormsModule],
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
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
        provideAuth(() => getAuth()),
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    component.video = { nativeElement: { srcObject: null, style: { display: '' } } } as any;
    component.canvas = { nativeElement: { style: { display: '' } } } as any;
    component.pickImageEl = { nativeElement: { style: { display: '' } } } as any;
    component.captureImageEl = { nativeElement: { style: { display: '' } } } as any;
    component.captureImageEl = { nativeElement: { style: { display: '' } } } as any;
    component.imageData = null;

    if (!navigator.mediaDevices) {
      (navigator as any).mediaDevices = {};
    }
    // Ensure getUserMedia exists to be spied on, if it doesn't already
    if (!navigator.mediaDevices.getUserMedia) {
      (navigator.mediaDevices as any).getUserMedia = () => Promise.resolve({});
    }
    
    spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve({} as MediaStream));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form on ngOnInit', () => {
    spyOn(component.authState$, 'subscribe').and.callFake((callback: any) => {
      callback({ uid: 'testUserId' });
      return new Subscription();
    });

    component.ngOnInit();

    expect(component.postForm).toBeDefined();
    expect(component.postForm.controls['title']).toBeDefined();
    expect(component.postForm.controls['location']).toBeDefined();
    expect(component.postForm.controls['image']).toBeDefined();
  });

  it('should handle file selection', () => {
    const file = new Blob(['test'], { type: 'image/webp' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toEqual(file);
    expect(component.imageData).toEqual(file);
  });

  it('should handle no file selection', () => {
    const event = { target: { files: [] } };
    component.onFileSelected(event);
    expect(component.selectedFile).toBeNull();
  });

  it('should re-capture image', () => {
    component.reCapture();

    expect(component.imageData).toBeNull();
  });

  it('should navigate on no click', () => {
    component.onNoClick();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should create post successfully', (done) => {
    component.imageData = 'mockImageData';

    component.createPost();

    expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(true);

    setTimeout(() => {
      expect(dataServiceMock.uploadFile).toHaveBeenCalledWith('mockImageData');
      expect(dataServiceMock.addPostToDatabase).toHaveBeenCalledWith(component.postForm.value, component.userId);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Post Created!', null, 3000);
      expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(false);
      done();
    }, 0);
  });

  it('should handle error on create post', (done) => {
    let errorMessage = new Error('Error');
    dataServiceMock.addPostToDatabase.and.returnValue(throwError(() => new Error('Error')));

    component.createPost();

    setTimeout(() => {
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith(errorMessage, null, 3000);
      done();
    }, 0);
  });

  it('should show snackbar if user is offline on init', () => {
    spyOnProperty(navigator, 'onLine').and.returnValue(false);
    component.ngOnInit();
    expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('You are offline!', null, 3000);
  });

  it('should initialize camera successfully', fakeAsync(() => {
    const mockStream = { id: 'testStream' } as any;
    (navigator.mediaDevices.getUserMedia as jasmine.Spy).and.returnValue(Promise.resolve(mockStream));

    component.initCamera();
    tick(); // Process the async/await promise resolution

    expect(component.canvas.nativeElement.style.display).toBe('none');
    expect(component.video.nativeElement.style.display).toBe('block');
  }));

  it('should handle camera access error', fakeAsync(() => {
    const mockError = new Error('Camera not found');
    (navigator.mediaDevices.getUserMedia as jasmine.Spy).and.returnValue(Promise.reject(mockError));
    spyOn(console, 'error');

    component.initCamera();
    tick(); // Process the async/await promise rejection

    expect(component.canvas.nativeElement.style.display).toBe('none');
    expect(component.video.nativeElement.style.display).toBe('block');
    expect(component.pickImageEl.nativeElement.style.display).toBe('block');
    expect(component.captureImageEl.nativeElement.style.display).toBe('none');
    expect(console.error).toHaveBeenCalledWith('Error accessing camera:', mockError);
  }));

  it('should capture image', () => {
    const mockContext = {
      drawImage: jasmine.createSpy('drawImage'),
    };
    const mockCanvas = {
      getContext: jasmine.createSpy('getContext').and.returnValue(mockContext),
      width: 0,
      height: 0,
      toDataURL: jasmine.createSpy('toDataURL').and.returnValue('mockImageData'),
      style: { display: 'none' },
    };
    const mockTrack = { stop: jasmine.createSpy('stop') };
    const mockVideo = {
      videoWidth: 100,
      videoHeight: 100,
      style: { display: 'block' },
      srcObject: {
        getVideoTracks: jasmine.createSpy('getVideoTracks').and.returnValue([mockTrack]),
      },
    };

    component.canvas = { nativeElement: mockCanvas } as any;
    component.video = { nativeElement: mockVideo } as any;

    component.captureImage();

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.width).toBe(100);
    expect(mockCanvas.height).toBe(100);
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockVideo, 0, 0);
    expect(mockVideo.style.display).toBe('none');
    expect(mockCanvas.style.display).toBe('block');
    expect(mockVideo.srcObject.getVideoTracks).toHaveBeenCalled();
    expect(mockTrack.stop).toHaveBeenCalled();
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/webp');
    expect(component.imageData).toBe('mockImageData');
  });
});
