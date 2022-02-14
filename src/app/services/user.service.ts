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
import { from } from 'rxjs';
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
}
