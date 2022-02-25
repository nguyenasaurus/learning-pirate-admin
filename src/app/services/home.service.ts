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
import { Home } from '../interfaces/home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const homeRef = collection(this.firestore, 'home');
    return addDoc(homeRef, data);
  }

  getById(id: string): Observable<Home> {
    const testimonialRef = doc(this.firestore, `home/${id}`);
    return docData(testimonialRef, {
      idField: 'id',
    }) as Observable<Home>;
  }

  update(id: string, data: any) {
    const testimonialRef = doc(this.firestore, `home/${id}`);
    return updateDoc(testimonialRef, data);
  }

  delete(id: string) {
    const testimonialRef = doc(this.firestore, `home/${id}`);
    return deleteDoc(testimonialRef);
  }

  getAll(): Observable<Home[]> {
    const testimonialRef = collection(this.firestore, 'home');
    return collectionData(testimonialRef, { idField: 'id' }) as Observable<
      Home[]
    >;
  }
}
