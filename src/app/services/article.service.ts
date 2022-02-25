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
import { Article } from '../interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const articlesRef = collection(this.firestore, 'articles');
    return addDoc(articlesRef, data);
  }

  getById(id: string): Observable<Article> {
    const articleRef = doc(this.firestore, `articles/${id}`);
    return docData(articleRef, { idField: 'id' }) as Observable<Article>;
  }

  update(id: string, data: any) {
    const articleDocRef = doc(this.firestore, `articles/${id}`);
    return updateDoc(articleDocRef, data);
  }

  delete(id: string) {
    const articleDocRef = doc(this.firestore, `articles/${id}`);
    return deleteDoc(articleDocRef);
  }

  getArticles(): Observable<Article[]> {
    const articleRef = collection(this.firestore, 'articles');
    return collectionData(articleRef, { idField: 'id' }) as Observable<
      Article[]
    >;
  }
}
