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
export class ConferenceService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const conferencesRef = collection(this.firestore, 'conferences');
    return addDoc(conferencesRef, data);
  }

  getById(id: string): Observable<Conference> {
    const conferenceRef = doc(this.firestore, `conferences/${id}`);
    return docData(conferenceRef, { idField: 'id' }) as Observable<Conference>;
  }

  update(id: string, data: any) {
    const conferenceRef = doc(this.firestore, `conferences/${id}`);
    return updateDoc(conferenceRef, data);
  }

  delete(id: string) {
    const conferenceRef = doc(this.firestore, `conferences/${id}`);
    return deleteDoc(conferenceRef);
  }

  updateAccountType(id: string, data: any) {
    const conferenceRef = doc(this.firestore, `conferences/${id}`);
    return updateDoc(conferenceRef, data);
  }

  getConferences(): Observable<Conference[]> {
    const conferenceRef = collection(this.firestore, 'conferences');
    return collectionData(conferenceRef, { idField: 'id' }) as Observable<
      Conference[]
    >;
  }
}
