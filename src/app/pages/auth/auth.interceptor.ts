import { AuthService } from '@/core/auth.service';
import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const publicUrls = [
        '/autenticacao/login',
        '/autenticacao/register',
        '/autenticacao/refresh'
    ];

    if (publicUrls.some(url => req.url.includes(url))) {
        return next(req);
    }

    const token = authService.getAccessToken();

    const authReq = token
        ? req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status === 401 && authService.getRefreshToken()) {
                return authService.refreshToken().pipe(
                    switchMap(res => {
                        const retryReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${res.access_token}`
                            }
                        });
                        return next(retryReq);
                    }),
                    catchError(refreshError => {
                        authService.logout();
                        router.navigate(['/autenticacao/login']);
                        return throwError(() => refreshError);
                    })
                );
            }

            if (error.status === 403) {
                router.navigate(['autenticacao/access-denied']);
            }

            return throwError(() => error);
        })
    );
};
