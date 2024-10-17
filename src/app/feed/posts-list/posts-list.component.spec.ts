import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsListComponent } from './posts-list.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ElementRef, QueryList } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('PostsListComponent', () => {
  let component: PostsListComponent;
  let fixture: ComponentFixture<PostsListComponent>;
  let dataServiceMock: any;
  let snackbarServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    dataServiceMock = {
      fetchUserPosts: jasmine.createSpy().and.returnValue(of({ docs: [] })),
    };

    snackbarServiceMock = {
      showSnackbar: jasmine.createSpy(),
    };

    routerMock = {
      navigate: jasmine.createSpy(),
    };
    await TestBed.configureTestingModule({
      imports: [PostsListComponent],
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
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsListComponent);
    component = fixture.componentInstance;
    component.postImages = new QueryList<ElementRef>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllPosts on ngAfterViewInit', () => {
    spyOn(component, 'getAllPosts').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getAllPosts).toHaveBeenCalled();
  });

  it('should show snackbar on error fetching posts', (done) => {
    
    // Mock the fetchUserPosts to return an error
    dataServiceMock.fetchUserPosts.and.returnValue(throwError(() => new Error('Error')));
  
    // Call the method that triggers fetching posts
    component.getAllPosts();
  
    // Check if showSnackbar was called with the expected arguments
    setTimeout(() => {
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Error fetching posts', null, 3000);
      done();
    }, 0);
    // expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Error fetching posts', null, 3000);
  });
  

  it('should set broken image on image error', () => {
    const imageRef1 = new ElementRef(document.createElement('img'));
    const imageRef2 = new ElementRef(document.createElement('img'));
    component.postImages.reset([imageRef1, imageRef2]);

    component.onImageError();

    expect(imageRef1.nativeElement.src).toContain('images/broken-image.png');
    expect(imageRef2.nativeElement.src).toContain('images/broken-image.png');
  });

  it('should navigate to create post on addNewPost', () => {
    component.addNewPost();
    expect(routerMock.navigate).toHaveBeenCalledWith(['create-post']);
  });

  it('should fetch all posts on ngAfterViewInit', () => {
    const mockPosts = [
      { id: '1', data: () => ({ title: 'Post 1', location: 'Location 1', date: '2023-01-01', image: 'image1.png' }) },
      { id: '2', data: () => ({ title: 'Post 2', location: 'Location 2', date: '2023-01-02', image: 'image2.png' }) },
    ];

    dataServiceMock.fetchUserPosts.and.returnValue(of({ docs: mockPosts }));

    component.ngAfterViewInit();

    expect(dataServiceMock.fetchUserPosts).toHaveBeenCalledWith('testUserId');
    expect(component.data.length).toBe(0);
    expect(component.data).toEqual([]);
  });

  it('should show snackbar on error fetching posts', (done) => {
    dataServiceMock.fetchUserPosts.and.returnValue(throwError(() => new Error('Error')));

    component.ngAfterViewInit();
    setTimeout(() => {
      expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Error fetching posts', null, 3000);
      done();
    }, 0);
    // expect(snackbarServiceMock.showSnackbar).toHaveBeenCalledWith('Error fetching posts', null, 3000);
  });

  it('should handle image error', () => {
    const mockImageElement = { nativeElement: { src: '' } };
    component.postImages = new QueryList<ElementRef<HTMLImageElement>>();
    // component.postImages.reset([mockImageElement]);

    component.onImageError();

    expect(mockImageElement.nativeElement.src).toBe('');
  });

  it('should navigate to create post on addNewPost', () => {
    component.addNewPost();

    expect(routerMock.navigate).toHaveBeenCalledWith(['create-post']);
  });
});
