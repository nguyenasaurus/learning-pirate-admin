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
import { LearningNeedSectionOne } from '../interfaces/learning-need';

@Injectable({
  providedIn: 'root',
})
export class LearningNeedsService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const ldRef = collection(this.firestore, 'learning-design');
    return addDoc(ldRef, data);
  }

  getById(id: string): Observable<any> {
    const learningDesignRef = doc(this.firestore, `learning-design/${id}`);
    return docData(learningDesignRef, {
      idField: 'id',
    }) as Observable<any>;
  }

  update(id: string, data: any) {
    const learningDesignRef = doc(this.firestore, `learning-design/${id}`);
    return updateDoc(learningDesignRef, data);
  }

  delete(id: string) {
    const learningDesignRef = doc(this.firestore, `learning-design/${id}`);
    return deleteDoc(learningDesignRef);
  }

  // getAll(): Observable<About[]> {
  //   const aboutRef = collection(this.firestore, 'about');
  //   return collectionData(aboutRef, { idField: 'id' }) as Observable<About[]>;
  // }
}
