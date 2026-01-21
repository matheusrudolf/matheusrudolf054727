import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { authInterceptor } from '@/pages/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
        provideAnimationsAsync(),
        providePrimeNG({
            translation: {
                choose: 'Selecionar',
                upload: 'Carregar',
                cancel: 'Cancelar',
                pending: 'pendente',
                completed: 'completado'
            },
            theme: {
                preset: Aura, options: {
                    darkModeSelector: '.app-dark'
                }
            }
        }),
        MessageService,
        ConfirmationService
    ]
};
