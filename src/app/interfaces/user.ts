export interface User {
  id?: string;
  email?: string;
  displayName?: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  displayName?: string;
  imageUrl?: string;
  accountType: string;
  phoneNumber?: string;
}
