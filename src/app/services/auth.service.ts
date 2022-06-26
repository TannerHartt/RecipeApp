import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

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
      });
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
