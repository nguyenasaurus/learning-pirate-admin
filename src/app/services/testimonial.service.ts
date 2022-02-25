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
import { Testimonial } from '../interfaces/testimonial';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  constructor(private firestore: Firestore) {}

  create(data: any) {
    const testimonialsRef = collection(this.firestore, 'testimonials');
    return addDoc(testimonialsRef, data);
  }

  getById(id: string): Observable<Testimonial> {
    const testimonialRef = doc(this.firestore, `testimonials/${id}`);
    return docData(testimonialRef, {
      idField: 'id',
    }) as Observable<Testimonial>;
  }

  update(id: string, data: any) {
    const testimonialRef = doc(this.firestore, `testimonials/${id}`);
    return updateDoc(testimonialRef, data);
  }

  delete(id: string) {
    const testimonialRef = doc(this.firestore, `testimonials/${id}`);
    return deleteDoc(testimonialRef);
  }

  getAll(): Observable<Testimonial[]> {
    const testimonialRef = collection(this.firestore, 'testimonials');
    return collectionData(testimonialRef, { idField: 'id' }) as Observable<
      Testimonial[]
    >;
  }
}
