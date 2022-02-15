export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  displayName?: string;
  imageUrl?: string;
  accountType: string;
  phoneNumber?: string;
}
