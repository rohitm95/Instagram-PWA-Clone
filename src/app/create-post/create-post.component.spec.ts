import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostComponent } from './create-post.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { SpinnerService } from '../shared/services/spinner.service';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let dataServiceMock: any;
  let snackbarServiceMock: any;
  let routerMock: any;
  let spinnerServiceMock: any;

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

    spinnerServiceMock = {
      showSpinner: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [CreatePostComponent, BrowserAnimationsModule, ReactiveFormsModule],
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
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    component.video = { nativeElement: { srcObject: null } };
    // component.canvas = { nativeElement: { getContext: () => ({}) } };
    component.imageData = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize the form and get location on ngOnInit', () => {
  //   spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success) => {
  //     success({
  //       coords: Object({ latitude: 0, longitude: 0 }),
  //       timestamp: 0,
  //       toJSON: function () {
  //         throw new Error('Function not implemented.');
  //       }
  //     });
  //   });

  //   component.ngOnInit();

  //   expect(component.postForm).toBeDefined();
  //   expect(snackbarServiceMock.showSnackbar).not.toHaveBeenCalled();
  // });

  // it('should show snackbar if offline on ngOnInit', () => {
  //   spyOn(navigator, 'onLine').and.returnValue(false);

  //   component.ngOnInit();

  //   expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('You are offline!', null, 3000);
  // });

  it('should handle file selection', () => {
    const file = new Blob(['test'], { type: 'image/jpeg' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);

    expect(component.selectedFile).toEqual(file);
    expect(component.imageData).toEqual(file);
  });

  // it('should initialize camera', () => {
  //   spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve({}));

  //   component.initCamera();

  //   expect(document.getElementById('canvas').style.display).toBe('none');
  //   expect(document.getElementById('player').style.display).toBe('block');
  // });

  // it('should handle location fetching', () => {
  //   spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success) => {
  //     success({ coords: { latitude: 0, longitude: 0 } });
  //   });

  //   component.getLocation();

  //   expect(component.postForm.controls['location'].value).toEqual({ lat: 0, lng: 0 });
  // });

  it('should re-initialize camera on reCapture', () => {
    spyOn(component, 'initCamera');

    component.reCapture();

    expect(component.imageData).toBeNull();
    expect(component.initCamera).toHaveBeenCalled();
  });

  // it('should capture image', () => {
  //   component.canvas.nativeElement.getContext = () => ({
  //     drawImage: jasmine.createSpy(),
  //   });
  //   component.video.nativeElement.videoWidth = 640;
  //   component.video.nativeElement.videoHeight = 480;

  //   component.captureImage();

  //   expect(component.canvas.nativeElement.width).toBe(640);
  //   expect(component.canvas.nativeElement.height).toBe(480);
  // });

  it('should navigate on onNoClick', () => {
    component.onNoClick();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should create a post', (done) => {
    component.imageData = 'mockImageData';
    component.createPost();

    expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(true);
    setTimeout(() => {
      expect(dataServiceMock.uploadFile).toHaveBeenCalledWith('mockImageData');
      expect(dataServiceMock.addPostToDatabase).toHaveBeenCalledWith(component.postForm.value);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Post Created!', null, 3000);
      expect(spinnerServiceMock.showSpinner).toHaveBeenCalledWith(false);
      done();
    }, 0);
  });
});
