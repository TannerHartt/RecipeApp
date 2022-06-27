import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from '../constants/auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  apiKey = 'AIzaSyAJZtosMjAH-lcB6DOSa4w7ojxRiRjFRZU';

  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`${this.baseUrl}${this.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(response => {
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
    ).pipe(catchError(this.handleError), tap(response => {
      this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
    }));
  }

  handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {

    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
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
