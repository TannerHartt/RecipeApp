import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from '../constants/auth/user.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  apiKey = 'AIzaSyAJZtosMjAH-lcB6DOSa4w7ojxRiRjFRZU';

  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`${this.baseUrl}${this.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(AuthService.handleError), tap(response => {
        this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(AuthService.handleError), tap(response => {
      this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
    }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {

    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private static handleError(errorRes: HttpErrorResponse) {
      let error = 'An unknown error occurred!';
      if (!errorRes.error || !errorRes.error.error) {
        return throwError(error);
      }
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          error = 'This email exists already';
          break;
        case 'EMAIL_NOT_FOUND':
          error = 'This email does not exist';
          break;
        case 'INVALID_PASSWORD':
          error = 'This password is not correct';
          break;
      }
      return throwError(error);
    }
}

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
