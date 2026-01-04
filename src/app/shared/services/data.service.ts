import { inject, Injectable } from '@angular/core';
import { asyncScheduler, scheduled } from 'rxjs';
import { Post } from '../post.model';
import { FirebaseDataService } from './firebase-data.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly firebaseDataService = inject(FirebaseDataService);

  addPostToDatabase(post: Post, userId) {
    let newPost = {
      ...post,
      date: new Date().toISOString(),
      userId: userId
    };
    return scheduled(
      this.firebaseDataService.addDocument(
        this.firebaseDataService.getCollection('availablePosts'),
        newPost
      ),
      asyncScheduler
    );
  }

  fetchUserPosts(userId: string) {
    const userTasksQuery = this.firebaseDataService.buildQuery(
      this.firebaseDataService.getCollection('availablePosts'),
      this.firebaseDataService.whereConstraint('userId', '==', userId),
      this.firebaseDataService.orderByConstraint('date', 'desc')
    );
    return scheduled(this.firebaseDataService.getDocuments(userTasksQuery), asyncScheduler);
  }

  deletePost(id) {
    return scheduled(
      this.firebaseDataService.deleteDocument(
        this.firebaseDataService.getDocumentRef('availablePosts', id)
      ),
      asyncScheduler
    );
  }

  getPostDetails(id) {
    return scheduled(
      this.firebaseDataService.getDocument(
        this.firebaseDataService.getDocumentRef('availablePosts', id)
      ),
      asyncScheduler
    );
  }

  async uploadFile(event) {
    let file;
    if (typeof event == 'string') {
      file = this.base64ToBlob(event);
    } else {
      file = event;
    }
    const storageURL =
      'https://firebasestorage.googleapis.com/v0/b/pwagram-f89ff.appspot.com/o/images';
    const filePath = `${storageURL}/${Date.now()}`;
    const storageRef = this.firebaseDataService.getStorageRef(filePath);
    await this.firebaseDataService.uploadFileBytes(storageRef, file);
    const fileURL = await this.firebaseDataService.getFileDownloadURL(storageRef);
    return fileURL;
  }

  base64ToBlob(base64) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.codePointAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/webp' });
  }

  // fetchAvailablePosts() {
  //   return scheduled(
  //     getDocs(collection(this.firestore, 'availablePosts')),
  //     asyncScheduler
  //   );
  // }
}
