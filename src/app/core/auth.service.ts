import { AuthResponse } from '@/shared/models/auth/auth-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly API_URL: string = environment.apiUrl;
    private readonly TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';

    public login(username: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${this.API_URL}/autenticacao/login`,
            { username, password }
        ).pipe(
            tap(res => this.storeTokens(res))
        );
    }

    public refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.getRefreshToken();

        return this.http.post<AuthResponse>(
            `${this.API_URL}/autenticacao/refresh`,
            {},
            {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${refreshToken}`
                })
            }
        ).pipe(
            tap(res => this.storeTokens(res))
        );
    }

    public logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    public getAccessToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    public getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    public isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }

    private storeTokens(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, res.refresh_token);
  }
}
