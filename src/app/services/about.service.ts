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
import { About, Gallery, Qualification } from '../interfaces/about';

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

  // Qualifications
  addQualification(data: any) {
    const qualificationsRef = collection(this.firestore, 'qualifications');
    return addDoc(qualificationsRef, data);
  }

  deleteQualification(id: string) {
    const aboutRef = doc(this.firestore, `qualifications/${id}`);
    return deleteDoc(aboutRef);
  }

  getQualifications(): Observable<Qualification[]> {
    const qualificationsRef = collection(this.firestore, 'qualifications');
    return collectionData(qualificationsRef, { idField: 'id' }) as Observable<
      Qualification[]
    >;
  }

  // gallery
  getGallery(): Observable<Gallery[]> {
    const galleryRef = collection(this.firestore, 'gallery');
    return collectionData(galleryRef, { idField: 'id' }) as Observable<
      Gallery[]
    >;
  }

  addGallery(data: any) {
    const galleryRef = collection(this.firestore, 'gallery');
    return addDoc(galleryRef, data);
  }

  deleteGallery(id: string) {
    const aboutRef = doc(this.firestore, `gallery/${id}`);
    return deleteDoc(aboutRef);
  }
}
