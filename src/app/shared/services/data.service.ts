import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import {
  ref,
  uploadBytes,
  Storage,
  getDownloadURL,
} from '@angular/fire/storage';
import { asyncScheduler, scheduled } from 'rxjs';
import { Post } from '../post.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  firestore = inject(Firestore);
  storage = inject(Storage);
  private userId;

  addPostToDatabase(post: Post) {
    let newPost = {
      ...post,
      date: new Date().toISOString(),
      userId: this.userId
    };
    return scheduled(
      addDoc(collection(this.firestore, 'availablePosts'), newPost),
      asyncScheduler
    );
  }

  // fetchAvailablePosts() {
  //   return scheduled(
  //     getDocs(collection(this.firestore, 'availablePosts')),
  //     asyncScheduler
  //   );
  // }

  fetchUserPosts(userId: string) {
    this.userId = userId;
    const userTasksQuery = query(
      collection(this.firestore, 'availablePosts'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    return scheduled(getDocs(userTasksQuery), asyncScheduler);
  }

  deletePost(id) {
    return scheduled(
      deleteDoc(doc(this.firestore, 'availablePosts', id)),
      asyncScheduler
    );
  }

  getPostDetails(id) {
    return scheduled(
      getDoc(doc(this.firestore, 'availablePosts', id)),
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
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);
    return fileURL;
  }

  private base64ToBlob(base64) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  }
}
