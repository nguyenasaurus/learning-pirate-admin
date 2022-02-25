import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';

import { from } from 'rxjs';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { sendPasswordResetEmail, signInWithCustomToken } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSignedIn: boolean;

  currentUser$ = authState(this.auth);

  constructor(private auth: Auth, private db: Firestore) {
    this.userSignedIn = false;

    auth.onAuthStateChanged((user: any) => {
      // Set up subscription
      if (user) {
        this.userSignedIn = true;
      } else {
        this.userSignedIn = false;
      }
    });
  }

  // Sign in user
  emailSignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(
      (result: any) => {
        localStorage.setItem('lpuid', result.user.uid);
      }
    );
  }

  // Sign up user
  userSignUp(data: any) {
    return createUserWithEmailAndPassword(
      this.auth,
      data.email,
      data.password
    ).then((result: any) => {
      console.log(result);
      let user = result.user;

      localStorage.setItem('lpuid', result.user.uid);

      // Update user record
      updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.imageUrl,
      });

      // Create user profile
      let payload = {
        email: data.email,
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
        accountType: data.accountType,
        imageUrl: data.imageUrl,
      };
      this.createUserProfile(user.uid, payload);
    });
  }

  // Create user profile
  createUserProfile(uid: string, data: any) {
    const usersRef = collection(this.db, 'users');
    return setDoc(doc(usersRef, uid), data);
  }

  // Change password
  changePassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  // // Reset Forggot password
  // ForgotPassword(passwordResetEmail) {
  //   return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
  //   .then(() => {
  //     window.alert('Password reset email sent, check your inbox.');
  //   }).catch((error) => {
  //     window.alert(error)
  //   })
  // }

  // Sign user out
  public signUserOut() {
    return from(this.auth.signOut());
  }
}
