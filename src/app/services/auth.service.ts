import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  apiKey = 'AIzaSyAJZtosMjAH-lcB6DOSa4w7ojxRiRjFRZU';

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`${this.baseUrl}${this.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(errorRes => {
        let error = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(error);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS': error = 'This email exists already'
      }
        return throwError(error);
    }));
  }
}

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
