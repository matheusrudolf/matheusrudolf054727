import { TestBed } from '@angular/core/testing';
import {
    HttpClient,
    HttpErrorResponse,
    provideHttpClient,
    withInterceptors
} from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '@/core/auth.service';
import { of, throwError } from 'rxjs';

describe('authInterceptor', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
            'getAccessToken',
            'getRefreshToken',
            'refreshToken',
            'logout'
        ]);

        routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(
                    withInterceptors([authInterceptor])
                ),
                provideHttpClientTesting(),
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('não deve adicionar Authorization header para URLs públicas', () => {
        http.post('/autenticacao/login', {}).subscribe();

        const req = httpMock.expectOne('/autenticacao/login');
        expect(req.request.headers.has('Authorization')).toBeFalse();

        req.flush({});
    });

    it('deve adicionar Authorization header quando houver access token', () => {
        authServiceSpy.getAccessToken.and.returnValue('fake-token');

        http.get('v1/pets').subscribe();

        const req = httpMock.expectOne('v1/pets');
        expect(req.request.headers.get('Authorization'))
            .toBe('Bearer fake-token');

        req.flush({});
    });

    it('deve tentar refresh token ao receber 401', () => {
        authServiceSpy.getAccessToken.and.returnValue('expired-token');
        authServiceSpy.getRefreshToken.and.returnValue('refresh-token');
        authServiceSpy.refreshToken.and.returnValue(
            of({ access_token: 'new-token' } as any)
        );

        http.get('v1/pets').subscribe();

        const firstReq = httpMock.expectOne('v1/pets');
        expect(firstReq.request.headers.get('Authorization'))
            .toBe('Bearer expired-token');

        firstReq.flush(
            {},
            { status: 401, statusText: 'Unauthorized' }
        );

        const retryReq = httpMock.expectOne('v1/pets');
        expect(retryReq.request.headers.get('Authorization'))
            .toBe('Bearer new-token');

        retryReq.flush({});
    });

    it('deve fazer logout e redirecionar para login se refresh token falhar', () => {
        authServiceSpy.getAccessToken.and.returnValue('expired-token');
        authServiceSpy.getRefreshToken.and.returnValue('refresh-token');
        authServiceSpy.refreshToken.and.returnValue(
            throwError(() => new HttpErrorResponse({ status: 401 }))
        );

        http.get('v1/pets').subscribe({
            error: () => { }
        });

        const req = httpMock.expectOne('v1/pets');
        req.flush(
            {},
            { status: 401, statusText: 'Unauthorized' }
        );

        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate)
            .toHaveBeenCalledWith(['/autenticacao/login']);
    });

    it('deve redirecionar para access-denied ao receber 403', () => {
        authServiceSpy.getAccessToken.and.returnValue('valid-token');

        http.get('v1/pets').subscribe({
            error: () => { }
        });

        const req = httpMock.expectOne('v1/pets');
        req.flush(
            {},
            { status: 403, statusText: 'Forbidden' }
        );

        expect(routerSpy.navigate)
            .toHaveBeenCalledWith(['autenticacao/access-denied']);
    });
});
