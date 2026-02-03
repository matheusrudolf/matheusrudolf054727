import { TestBed } from '@angular/core/testing';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '@/core/auth.service';

describe('authGuard', () => {
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = { url: '/pets' } as RouterStateSnapshot;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [
            'isLoggedIn',
            'logout'
        ]);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authServiceSpy }
            ]
        });
    });

    it('deve permitir acesso quando o usuário estiver logado', () => {
        authServiceSpy.isLoggedIn.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() =>
            authGuard(mockRoute, mockState)
        );

        expect(result).toBeTrue();
        expect(authServiceSpy.logout).not.toHaveBeenCalled();
    });

    it('deve bloquear acesso e executar logout quando o usuário não estiver logado', () => {
        authServiceSpy.isLoggedIn.and.returnValue(false);

        const result = TestBed.runInInjectionContext(() =>
            authGuard(mockRoute, mockState)
        );

        expect(result).toBeFalse();
        expect(authServiceSpy.logout).toHaveBeenCalled();
    });
});
