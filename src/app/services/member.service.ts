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
import { Member } from '../interfaces/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const membersRef = collection(this.firestore, 'members');
    return addDoc(membersRef, data);
  }

  getById(id: string): Observable<Member> {
    const memberRef = doc(this.firestore, `members/${id}`);
    return docData(memberRef, { idField: 'id' }) as Observable<Member>;
  }

  update(id: string, data: any) {
    const memberRef = doc(this.firestore, `members/${id}`);
    return updateDoc(memberRef, data);
  }

  delete(id: string) {
    const memberRef = doc(this.firestore, `members/${id}`);
    return deleteDoc(memberRef);
  }

  getAll(): Observable<Member[]> {
    const memberRef = collection(this.firestore, 'members');
    return collectionData(memberRef, { idField: 'id' }) as Observable<Member[]>;
  }
}
