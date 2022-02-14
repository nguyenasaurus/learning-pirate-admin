import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from '@angular/fire/auth';

import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSignedIn: boolean;

  currentUser$ = authState(this.auth);

  constructor(
    private router: Router,
    private auth: Auth,
    private fireStore: Firestore
  ) {
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
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Sign up user
  userSignUp(email: string, password: string, displayName: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(({ user }) => updateProfile(user, { displayName: displayName }))
    );
  }

  // // Setup user
  // setUpUser(user: any) {
  //   sendEmailVerification(user);

  //   // create user in db
  //   const userRef = collection(this.fireStore, 'users');
  //   return from(setDoc(doc(userRef, user.email), user));
  // }

  // Reset password
  public resetPassword(email: string): Promise<any> {
    // sends reset password email
    return sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log('RPC: Mail Sent');
      })
      .catch((error) => {
        console.log('Auth Service: Reset password Error');
        console.log('Error code: ', error.code);
        console.log('Error: ', error);

        if (error.code) {
          return error;
        } else {
          return '';
        }
      });
  }

  // Resend verification email
  public resendVerificationEmail() {
    // sends reset password email
    let currentUser = this.auth.currentUser;
    return sendEmailVerification(currentUser!)
      .then(() => {
        console.log('RPC: Mail Sent');
      })
      .catch((error) => {
        console.log('Auth Service: Sending email verification Error');
        console.log('Error code: ', error.code);
        console.log('Error: ', error);

        if (error.code) {
          return error;
        } else {
          return '';
        }
      });
  }

  // Sign user out
  public signUserOut() {
    return from(this.auth.signOut());
  }

  // Sign up user
  public setUserInfo(data: any): Promise<any> {
    const userRef = collection(this.fireStore, 'users');
    return setDoc(doc(userRef, data.email), data)
      .then(async (result) => {
        console.log('Updated');
      })
      .catch((error) => {
        console.log('Sign up error:', error);
        if (error.code) {
          return {
            isValid: false,
            message: error.message,
          };
        } else {
          return '';
        }
      });
  }
}
