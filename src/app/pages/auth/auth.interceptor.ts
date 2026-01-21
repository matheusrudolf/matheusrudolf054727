import { AuthService } from '@/core/auth.service';
import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const publicUrls = ['/auth/login', '/auth/register', '/auth/refresh'];
    const isPublicUrl = publicUrls.some(url => req.url.includes(url));

    if (isPublicUrl) {
        return next(req);
    }

    // Adiciona o token JWT ao cabeçalho
    const token = authService.getToken();

    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Se receber 401 Unauthorized, tenta renovar o token
            if (error.status === 401 && !req.url.includes('/auth/refresh')) {
                // Se já há refresh em andamento, espera
                if (authService.refreshInProgress) {
                    return authService.refreshTokenSubject.pipe(
                        filter(t => t !== null),
                        take(1),
                        switchMap(newToken => {
                            const cloned = req.clone({
                                setHeaders: { Authorization: `Bearer ${newToken}` }
                            });
                            return next(cloned);
                        })
                    );
                }

                authService.refreshInProgress = true;
                authService.refreshTokenSubject.next(null);

                return authService.refreshToken().pipe(
                    switchMap((newTokens) => {
                        authService.refreshInProgress = false;
                        authService.refreshTokenSubject.next(newTokens.accessToken);

                        const cloned = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newTokens.accessToken}`
                            }
                        });

                        return next(cloned);
                    }),
                    catchError(refreshErr => {
                        authService.refreshInProgress = false;
                        authService.logout();
                        router.navigate(['/auth/login']);
                        return throwError(() => refreshErr);
                    })
                );
            }

            // SE receber 403 Forbidden, redireciona para página de acesso negado
            if (error.status === 403) {
                router.navigate(['auth/access-denied']);
            }

            return throwError(() => error);
        })
    );
};
