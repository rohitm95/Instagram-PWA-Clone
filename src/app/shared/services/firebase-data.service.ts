import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  CollectionReference,
  QueryConstraint
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDataService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  getCollection(path: string): CollectionReference {
    return collection(this.firestore, path);
  }

  addDocument(collectionRef: CollectionReference, data: any) {
    return addDoc(collectionRef, data);
  }

  getDocuments(queryOrRef: any) {
    return getDocs(queryOrRef);
  }

  buildQuery(collectionRef: CollectionReference, ...constraints: QueryConstraint[]) {
    return query(collectionRef, ...constraints);
  }

  whereConstraint(field: string, op: any, value: any) {
    return where(field, op, value);
  }

  orderByConstraint(field: string, direction: any) {
    return orderBy(field, direction);
  }

  getDocumentRef(path: string, id: string) {
    return doc(this.firestore, path, id);
  }

  getDocument(docRef: any) {
    return getDoc(docRef);
  }

  deleteDocument(docRef: any) {
    return deleteDoc(docRef);
  }

  getStorageRef(path: string) {
    return ref(this.storage, path);
  }

  uploadFileBytes(storageRef: any, file: any) {
    return uploadBytes(storageRef, file);
  }

  getFileDownloadURL(storageRef: any) {
    return getDownloadURL(storageRef);
  }
}
