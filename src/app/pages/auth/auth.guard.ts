import { AuthService } from '@/core/auth.service';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        router.navigate(['auth/login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }

    return true;
};

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        router.navigate(['auth/login']);
        return false;
    }

    // Verifica se a rota exige roles especificas
    const requiredRoles = route.data['roles'] as string[];

    if (requiredRoles && requiredRoles.length > 0) {
        const hasRoles = authService.hasAnyRole(requiredRoles);

        if (!hasRoles) {
            router.navigate(['auth/access-denied']);
            return false;
        }
    }

    return true;
};
