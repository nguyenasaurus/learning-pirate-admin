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
import { About } from '../interfaces/about';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const aboutRef = collection(this.firestore, 'about');
    return addDoc(aboutRef, data);
  }

  getById(id: string): Observable<About> {
    const aboutRef = doc(this.firestore, `about/${id}`);
    return docData(aboutRef, {
      idField: 'id',
    }) as Observable<About>;
  }

  update(id: string, data: any) {
    const aboutRef = doc(this.firestore, `about/${id}`);
    return updateDoc(aboutRef, data);
  }

  delete(id: string) {
    const aboutRef = doc(this.firestore, `about/${id}`);
    return deleteDoc(aboutRef);
  }

  getAll(): Observable<About[]> {
    const aboutRef = collection(this.firestore, 'about');
    return collectionData(aboutRef, { idField: 'id' }) as Observable<About[]>;
  }
}
