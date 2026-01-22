import { AuthService } from '@/core/auth.service';
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        router.navigate(['autenticacao/login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }

    return true;
};
