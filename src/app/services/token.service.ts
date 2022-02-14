import { Injectable } from '@angular/core';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  /**
   * saveToken: save signed in user token
   */
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    const bearerToken = 'Bearer ' + token;
    window.sessionStorage.setItem(TOKEN_KEY, bearerToken);
  }

  /**
   * getToken: retrieves stored user token
   */
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * getAuthorizationHeader
   */
  public getAuthorizationHeader() {
    const token = this.getToken();
    if (token) {
      return token;
    } else {
      return null;
    }
  }
}
