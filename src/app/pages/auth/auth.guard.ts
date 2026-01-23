import { AuthService } from '@/core/auth.service';
import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (_route, state) => {
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
        authService.logout();
        return false;
    }

    return true;
};

