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
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Bod } from '../interfaces/bod';

@Injectable({
  providedIn: 'root',
})
export class BodService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const bodsRef = collection(this.firestore, 'bods');
    return addDoc(bodsRef, data);
  }

  getById(id: string): Observable<Bod> {
    const bodRef = doc(this.firestore, `bods/${id}`);
    return docData(bodRef, { idField: 'id' }) as Observable<Bod>;
  }

  update(id: string, data: any) {
    const bodDocRef = doc(this.firestore, `bods/${id}`);
    return updateDoc(bodDocRef, data);
  }

  delete(id: string) {
    const bodDocRef = doc(this.firestore, `bods/${id}`);
    return deleteDoc(bodDocRef);
  }

  getbods(): Observable<Bod[]> {
    const bodRef = collection(this.firestore, 'bods');
    return collectionData(bodRef, { idField: 'id' }) as Observable<Bod[]>;
  }
}
