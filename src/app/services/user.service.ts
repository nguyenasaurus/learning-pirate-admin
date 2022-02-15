import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
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
import { from, Observable } from 'rxjs';
import { UserProfile } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  create(user: any) {
    const usersRef = collection(this.firestore, 'users');
    return from(addDoc(usersRef, user));
  }

  getUserById(id: string): Observable<UserProfile> {
    const userRef = doc(this.firestore, `users/${id}`);
    return docData(userRef, { idField: 'id' }) as Observable<UserProfile>;
  }

  update(id: string, data: any) {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return setDoc(userDocRef, data);
    return updateDoc(userDocRef, data);
  }

  updateAccountType(id: string, data: any) {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userDocRef, data);
  }

  getUsers(): Observable<UserProfile[]> {
    const userRef = collection(this.firestore, 'users');
    return collectionData(userRef, { idField: 'id' }) as Observable<
      UserProfile[]
    >;
  }
}
