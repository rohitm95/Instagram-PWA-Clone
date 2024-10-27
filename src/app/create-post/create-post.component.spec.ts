import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostComponent } from './create-post.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
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
        provideAuth(() => getAuth()),
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    component.video = { nativeElement: { srcObject: null } };
    component.imageData = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form on ngOnInit', () => {
    spyOn(component.authState$, 'subscribe').and.callFake((callback) => {
      callback({ uid: 'testUserId' });
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
    dataServiceMock.addPostToDatabase.and.returnValue(throwError(() => new Error('Error')));

    component.createPost();

    setTimeout(() => {
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Error', null, 3000);
      done();
    }, 0);
  });
});
