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
import {
  LdProcesses,
  LearningNeedSectionOne,
} from '../interfaces/learning-need';

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

  getProcesses(): Observable<LdProcesses[]> {
    const ldRef = collection(this.firestore, 'process');
    return collectionData(ldRef, { idField: 'id' }) as Observable<
      LdProcesses[]
    >;
  }

  updateLearningDesign(id: string, data: any) {
    const learningDesignRef = doc(this.firestore, `process/${id}`);
    return updateDoc(learningDesignRef, data);
  }
}
