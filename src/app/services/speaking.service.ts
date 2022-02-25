import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  deleteDoc,
  updateDoc,
  DocumentReference,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeakingService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const ldRef = collection(this.firestore, 'speaking');
    return addDoc(ldRef, data);
  }

  getById(id: string): Observable<any> {
    const speakingRef = doc(this.firestore, `speaking/${id}`);
    return docData(speakingRef, {
      idField: 'id',
    }) as Observable<any>;
  }

  update(id: string, data: any) {
    const speakingRef = doc(this.firestore, `speaking/${id}`);
    return updateDoc(speakingRef, data);
  }

  delete(id: string) {
    const speakingRef = doc(this.firestore, `speaking/${id}`);
    return deleteDoc(speakingRef);
  }

  // getAll(): Observable<About[]> {
  //   const aboutRef = collection(this.firestore, 'about');
  //   return collectionData(aboutRef, { idField: 'id' }) as Observable<About[]>;
  // }
}
