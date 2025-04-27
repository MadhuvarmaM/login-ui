import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  LoginPayload,
  SignupPayload,
  AuthResponse,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly API = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    console.log(payload, 'from api service');
    return this.http
      .post<AuthResponse>(`${this.API}/login`, payload, {
        withCredentials: true,
      })
      .pipe(tap((res) => this.storeTokens(res)));
  }

  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API}/signup`, payload)
      .pipe(tap((res) => this.storeTokens(res)));
  }

  public decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  public storeTokens(res: AuthResponse): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, res.accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, res.refreshToken);

    const decodedToken = this.decodeToken(res.accessToken);
    const userRole = decodedToken?.role ?? '';

    sessionStorage.setItem('role', userRole);
  }

  logout(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem('role');
    console.log(
      'logout successfully:',
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY)
    );
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    const token = sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    console.log('Access Token retrieved:', token);
    return token;
  }

  getRefreshToken(): string | null {
    const token = sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    console.log('Refresh Token retrieved:', token);
    return token;
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    console.log('Will send refresh token:', refreshToken);
    return this.http
      .post<AuthResponse>('/api/auth/refresh-token', { refreshToken })
      .pipe(tap((res) => this.storeTokens(res)));
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  }

  getDecodedToken(): any | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  getUserRole(): string {
    const role = sessionStorage.getItem('role');
    console.log('User role retrieved:', role);
    return role ?? '';
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/check-email?email=${email}`);
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }
}
