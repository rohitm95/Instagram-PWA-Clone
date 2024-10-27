import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import {
  Firestore,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getStorage, provideStorage, Storage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { Post } from '../post.model';

describe('DataService', () => {
  let service: DataService;
  let firestoreMock: any;
  let storageMock: any;

  beforeEach(() => {
    firestoreMock = {
      collection: jasmine.createSpy().and.returnValue({
        add: jasmine.createSpy(),
        get: jasmine.createSpy().and.returnValue(of([])),
      }),
    };

    storageMock = {
      ref: jasmine.createSpy().and.returnValue({
        put: jasmine.createSpy(),
        getDownloadURL: jasmine
          .createSpy()
          .and.returnValue(Promise.resolve('mockDownloadURL')),
      }),
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
        provideStorage(() => getStorage()),
        { provide: Firestore, useValue: firestoreMock },
        { provide: Storage, useValue: storageMock },
        provideFirestore(() => getFirestore()),
      ],
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a post to the database', (done) => {
    const post: Post = {
      id: '1',
      title: 'Test Post',
      location: 'Test Content',
    };
    const userId = '1abc';
    service.addPostToDatabase(post, userId).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availablePosts');
      done();
    });
  });

  it('should fetch user posts', (done) => {
    const userId = 'testUserId';
    service.fetchUserPosts(userId).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availablePosts');
      expect(firestoreMock.collection().get).toHaveBeenCalled();
      done();
    });
  });

  it('should delete a post', (done) => {
    const postId = 'testPostId';
    service.deletePost(postId).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availablePosts');
      done();
    });
  });

  it('should get post details', (done) => {
    const postId = 'testPostId';
    service.getPostDetails(postId).subscribe(() => {
      expect(firestoreMock.collection).toHaveBeenCalledWith('availablePosts');
      done();
    });
  });

  it('should upload a file and return the download URL', async () => {
    const file = new Blob(['test'], { type: 'image/jpeg' });
    const result = await service.uploadFile(file);
    expect(storageMock.ref).toHaveBeenCalled();
    expect(result).toBe('mockDownloadURL');
  });
});
