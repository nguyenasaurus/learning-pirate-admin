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
import { Podcast } from '../interfaces/podcast';

@Injectable({
  providedIn: 'root',
})
export class PodcastService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const podcastsRef = collection(this.firestore, 'podcasts');
    return addDoc(podcastsRef, data);
  }

  getById(id: string): Observable<Podcast> {
    const podcastRef = doc(this.firestore, `podcasts/${id}`);
    return docData(podcastRef, { idField: 'id' }) as Observable<Podcast>;
  }

  update(id: string, data: any) {
    const podcastRef = doc(this.firestore, `podcasts/${id}`);
    return updateDoc(podcastRef, data);
  }

  delete(id: string) {
    const podcastRef = doc(this.firestore, `podcasts/${id}`);
    return deleteDoc(podcastRef);
  }

  getPodcasts(): Observable<Podcast[]> {
    const podcastRef = collection(this.firestore, 'podcasts');
    return collectionData(podcastRef, { idField: 'id' }) as Observable<
      Podcast[]
    >;
  }
}
