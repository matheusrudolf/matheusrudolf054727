import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { AuthResponse } from '@/shared/models/auth/auth-response';
import { environment } from 'src/environments/environment.local';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockAuthResponse: AuthResponse = {
        access_token: 'access-token',
        expires_in: 300,
        refresh_token: 'refresh-token',
        refresh_expires_in: 1800
    };

    beforeEach(() => {
        routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: Router, useValue: routerSpy }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);

        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('deve realizar login, salvar tokens e retornar response', () => {
            service.login('admin', 'admin').subscribe(res => {
                expect(res).toEqual(mockAuthResponse);
            });

            const req = httpMock.expectOne(
                `${environment.apiUrl}/autenticacao/login`
            );

            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({
                username: 'admin',
                password: 'admin'
            });

            req.flush(mockAuthResponse);

            expect(localStorage.getItem('access_token'))
                .toBe(mockAuthResponse.access_token);

            expect(localStorage.getItem('refresh_token'))
                .toBe(mockAuthResponse.refresh_token);
        });
    });

    describe('refreshToken', () => {
        it('deve renovar o token usando refresh token e atualizar o storage', () => {
            localStorage.setItem('refresh_token', 'old-refresh-token');

            service.refreshToken().subscribe(res => {
                expect(res).toEqual(mockAuthResponse);
            });

            const req = httpMock.expectOne(
                `${environment.apiUrl}/autenticacao/refresh`
            );

            expect(req.request.method).toBe('PUT');
            expect(req.request.headers.get('Authorization'))
                .toBe('Bearer old-refresh-token');

            req.flush(mockAuthResponse);

            expect(localStorage.getItem('access_token'))
                .toBe(mockAuthResponse.access_token);

            expect(localStorage.getItem('refresh_token'))
                .toBe(mockAuthResponse.refresh_token);
        });
    });

    describe('logout', () => {
        it('deve limpar tokens e redirecionar para login', () => {
            localStorage.setItem('access_token', 'token');
            localStorage.setItem('refresh_token', 'refresh');

            service.logout();

            expect(localStorage.getItem('access_token')).toBeNull();
            expect(localStorage.getItem('refresh_token')).toBeNull();
            expect(routerSpy.navigate)
                .toHaveBeenCalledWith(['/autenticacao/login']);
        });
    });

    describe('getAccessToken / getRefreshToken', () => {
        it('deve retornar tokens do localStorage', () => {
            localStorage.setItem('access_token', 'token123');
            localStorage.setItem('refresh_token', 'refresh123');

            expect(service.getAccessToken()).toBe('token123');
            expect(service.getRefreshToken()).toBe('refresh123');
        });

        it('deve retornar null se não houver tokens', () => {
            expect(service.getAccessToken()).toBeNull();
            expect(service.getRefreshToken()).toBeNull();
        });
    });

    describe('isLoggedIn', () => {
        it('deve retornar true quando houver access token', () => {
            localStorage.setItem('access_token', 'token');

            expect(service.isLoggedIn()).toBeTrue();
        });

        it('deve retornar false quando não houver access token', () => {
            expect(service.isLoggedIn()).toBeFalse();
        });
    });
});
