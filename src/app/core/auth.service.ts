import { AuthResponse } from '@/shared/models/auth/auth-response';
import { LoginRequest } from '@/shared/models/auth/login-request';
import { NewPassword, ResetPassword } from '@/shared/models/auth/reset-password';
import { Usuario } from '@/shared/models/auth/usuario';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly API_URL: string = `${environment.apiUrl}/api`;
    private readonly TOKEN_KEY: string = 'accessToken';
    private readonly REFRESH_TOKEN_KEY: string = 'refreshToken';
    private readonly USER_KEY: string = 'userData';
    private readonly REMEMBER_ME_KEY: string = 'rememberMe';

    public refreshInProgress = false;
    public refreshTokenSubject = new BehaviorSubject<string | null>(null);

    private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
    public currentUser$ = this.currentUserSubject.asObservable();

    private tokenExpirationTimer: any;

    constructor() {
        this.initializeTokenRefresh();
    }

    public login(credentials: LoginRequest, rememberMe: boolean = false): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
            .pipe(
                tap(response => {
                    this.setSession(response, rememberMe);
                })
            );
    }

    public logout(): void {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        // Limpa de ambos os storages
        this.clearStorage(this.TOKEN_KEY);
        this.clearStorage(this.REFRESH_TOKEN_KEY);
        this.clearStorage(this.USER_KEY);
        this.clearStorage(this.REMEMBER_ME_KEY);

        this.currentUserSubject.next(null);
        this.router.navigate(['auth/login']);
    }

    public resetPasswordRequest(email: string): Observable<ResetPassword> {
        return this.http.post<ResetPassword>(`${this.API_URL}/auth/password-reset/request`, { email });
    }

    public validateEmailCodeVerification(email: string, code: number): Observable<ResetPassword> {
        return this.http.post<ResetPassword>(`${this.API_URL}/auth/password-reset/validate-code`, { email, code });
    }

    public resetPassword(newPassword: NewPassword): Observable<ResetPassword> {
        return this.http.post<ResetPassword>(`${this.API_URL}/auth/password-reset/reset`, newPassword);
    }

    public refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }

        return this.http.post<AuthResponse>(`${this.API_URL}/auth/refresh`, null, {
            params: { refreshToken }
        }).pipe(
            tap(response => {
                const rememberMe = this.isRememberMeEnabled();
                this.setSession(response, rememberMe);
            })
        );
    }

    public getToken(): string | null {
        return this.getFromStorage(this.TOKEN_KEY);
    }

    public getRefreshToken(): string | null {
        return this.getFromStorage(this.REFRESH_TOKEN_KEY);
    }

    public isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        return !this.isTokenExpired(token);
    }

    public isRememberMeEnabled(): boolean {
        const rememberMe = this.getFromStorage(this.REMEMBER_ME_KEY);
        return rememberMe === 'true';
    }

    private initializeTokenRefresh(): void {
        const token = this.getToken();
        if (token && !this.isTokenExpired(token)) {
            this.scheduleTokenRefresh();
        }
    }

    private setSession(authResult: AuthResponse, rememberMe: boolean): void {
        // Armazena a preferência de "lembrar-me"
        this.setToStorage(this.REMEMBER_ME_KEY, String(rememberMe), rememberMe);

        // Armazena os tokens
        this.setToStorage(this.TOKEN_KEY, authResult.accessToken, rememberMe);

        if (authResult.refreshToken) {
            this.setToStorage(this.REFRESH_TOKEN_KEY, authResult.refreshToken, rememberMe);
        }

        this.loadUserInfo(rememberMe);
        this.scheduleTokenRefresh();
    }

    private scheduleTokenRefresh(): void {
        // Limpa timer anterior
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        const token = this.getToken();
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            const now = Date.now();

            if (now >= exp) {
                console.warn('Token já expirado');
                this.logout();
                return;
            }

            const fiveMinutes = 5 * 60 * 1000;
            const timeUntilExpiration = exp - now;

            const timeUntilRefresh = timeUntilExpiration <= fiveMinutes
                ? 1000
                : timeUntilExpiration - fiveMinutes;

            console.log(`Token refresh agendado para daqui a ${Math.floor(timeUntilRefresh / 1000 / 60)} minutos`);

            this.tokenExpirationTimer = setTimeout(() => {
                console.log('Executando refresh automático do token...');
                this.refreshToken().subscribe({
                    next: () => console.log('Token renovado com sucesso'),
                    error: (err) => {
                        console.error('Erro ao renovar token:', err);
                        this.logout();
                    }
                });
            }, timeUntilRefresh);
        } catch (error) {
            console.error('Erro ao agendar refresh do token:', error);
            this.logout();
        }
    }

    private loadUserInfo(rememberMe: boolean): void {
        const token = this.getToken();
        if (token) {
            const user = this.decodeToken(token);
            this.setToStorage(this.USER_KEY, JSON.stringify(user), rememberMe);
            this.currentUserSubject.next(user);
        }
    }

    private getUserFromStorage(): Usuario | null {
        const userData = this.getFromStorage(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    private decodeToken(token: string): Usuario {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                username: payload.sub || payload.username,
                roles: payload.roles || payload.authorities || []
            };
        } catch (error) {
            console.error('Erro ao decodificar token: ', error);
            return { username: '', roles: [] };
        }
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            return Date.now() >= exp;
        } catch (error) {
            return true;
        }
    }

    public hasRole(role: string): boolean {
        const user = this.currentUserSubject.value;
        return user?.roles?.includes(role) || false;
    }

    public hasAnyRole(roles: string[]): boolean {
        const user = this.currentUserSubject.value;
        return roles.some(role => user?.roles?.includes(role)) || false;
    }

    private setToStorage(key: string, value: string, usePersistent: boolean): void {
        const storage = usePersistent ? localStorage : sessionStorage;
        storage.setItem(key, value);
    }

    private getFromStorage(key: string): string | null {
        return localStorage.getItem(key) || sessionStorage.getItem(key);
    }

    private clearStorage(key: string): void {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    }
}
