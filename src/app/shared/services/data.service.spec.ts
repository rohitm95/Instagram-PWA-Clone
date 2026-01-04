import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { FirebaseDataService } from './firebase-data.service';
import { Post } from '../post.model';

describe('DataService', () => {
  let service: DataService;
  let firebaseDataServiceMock: any;

  beforeEach(() => {
    firebaseDataServiceMock = {
      getCollection: jasmine.createSpy('getCollection').and.returnValue('mockCollection'),
      addDocument: jasmine.createSpy('addDocument').and.returnValue(Promise.resolve({ id: 'newId' })),
      buildQuery: jasmine.createSpy('buildQuery').and.returnValue('mockQuery'),
      whereConstraint: jasmine.createSpy('whereConstraint').and.returnValue('mockWhere'),
      orderByConstraint: jasmine.createSpy('orderByConstraint').and.returnValue('mockOrderBy'),
      getDocuments: jasmine.createSpy('getDocuments').and.returnValue(Promise.resolve({ docs: [] })),
      getDocumentRef: jasmine.createSpy('getDocumentRef').and.returnValue('mockDocRef'),
      deleteDocument: jasmine.createSpy('deleteDocument').and.returnValue(Promise.resolve()),
      getDocument: jasmine.createSpy('getDocument').and.returnValue(Promise.resolve({ id: 'docId', data: () => ({}) })),
      getStorageRef: jasmine.createSpy('getStorageRef').and.returnValue('mockStorageRef'),
      uploadFileBytes: jasmine.createSpy('uploadFileBytes').and.returnValue(Promise.resolve()),
      getFileDownloadURL: jasmine.createSpy('getFileDownloadURL').and.returnValue(Promise.resolve('mockUrl')),
    };

    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: FirebaseDataService, useValue: firebaseDataServiceMock },
      ],
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add post to database', (done) => {
    const post: Post = { 
      id: '1',
      title: 'Test Post',
      location: 'Test Content',
     };
    const userId = 'user123';
    
    service.addPostToDatabase(post, userId).subscribe(result => {
        expect(firebaseDataServiceMock.getCollection).toHaveBeenCalledWith('availablePosts');
        expect(firebaseDataServiceMock.addDocument).toHaveBeenCalled();
        done();
    });
  });

  it('should fetch user posts', (done) => {
      service.fetchUserPosts('uid').subscribe(res => {
          expect(firebaseDataServiceMock.getCollection).toHaveBeenCalledWith('availablePosts');
          expect(firebaseDataServiceMock.whereConstraint).toHaveBeenCalledWith('userId', '==', 'uid');
          expect(firebaseDataServiceMock.orderByConstraint).toHaveBeenCalledWith('date', 'desc');
          expect(firebaseDataServiceMock.buildQuery).toHaveBeenCalled();
          expect(firebaseDataServiceMock.getDocuments).toHaveBeenCalled();
          done();
      });
  });
  
  it('should delete post', (done) => {
      service.deletePost('id').subscribe(() => {
          expect(firebaseDataServiceMock.getDocumentRef).toHaveBeenCalledWith('availablePosts', 'id');
          expect(firebaseDataServiceMock.deleteDocument).toHaveBeenCalled();
          done();
      });
  });
  
  it('should get post details', (done) => {
      service.getPostDetails('id').subscribe(() => {
          expect(firebaseDataServiceMock.getDocumentRef).toHaveBeenCalledWith('availablePosts', 'id');
          expect(firebaseDataServiceMock.getDocument).toHaveBeenCalled();
          done();
      });
  });
  
  it('should upload string file (base64)', async () => {
      // Logic for base64: "data:image/webp;base64,....". atob splits by comma.
      const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGNiAAAABgADNjd8qAAAAABJRU5ErkJggg==";
      const url = await service.uploadFile(base64);
      expect(url).toBe('mockUrl');
      expect(firebaseDataServiceMock.getStorageRef).toHaveBeenCalled();
      expect(firebaseDataServiceMock.uploadFileBytes).toHaveBeenCalled();
  });
  
  it('should upload blob file', async () => {
      const blob = new Blob([''], {type: 'image/png'});
      const url = await service.uploadFile(blob);
      expect(url).toBe('mockUrl');
      expect(firebaseDataServiceMock.getStorageRef).toHaveBeenCalled();
      expect(firebaseDataServiceMock.uploadFileBytes).toHaveBeenCalled();
  });

  // Re-include existing base64ToBlob tests logic implicitly covered by upload string file, but specific tests are good too.
  it('should convert a valid base64 string to a Blob', () => {
    const base64String = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    const blob = service.base64ToBlob(base64String);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/webp');
  });

  it('should handle an invalid base64 string', () => {
    const base64String = 'invalid_base64_string';
    expect(() => service.base64ToBlob(base64String)).toThrowError();
  });
});
