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
import { Conference } from '../interfaces/conference';

@Injectable({
  providedIn: 'root',
})
export class WebinarService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const webinarsRef = collection(this.firestore, 'webinars');
    return addDoc(webinarsRef, data);
  }

  getById(id: string): Observable<Conference> {
    const conferenceRef = doc(this.firestore, `webinars/${id}`);
    return docData(conferenceRef, { idField: 'id' }) as Observable<Conference>;
  }

  update(id: string, data: any) {
    const webinarRef = doc(this.firestore, `webinars/${id}`);
    return updateDoc(webinarRef, data);
  }

  delete(id: string) {
    const webinarRef = doc(this.firestore, `webinars/${id}`);
    return deleteDoc(webinarRef);
  }

  updateAccountType(id: string, data: any) {
    const webinarRef = doc(this.firestore, `webinars/${id}`);
    return updateDoc(webinarRef, data);
  }

  getWebinars(): Observable<Conference[]> {
    const webinarRef = collection(this.firestore, 'webinars');
    return collectionData(webinarRef, { idField: 'id' }) as Observable<
      Conference[]
    >;
  }
}
