import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { HomeComponent } from '@/pages/home/home.component';
import { NotfoundComponent } from '@/pages/notfound/notfound.component';
import { UsuariosComponent } from '@/pages/usuarios/usuarios.component';
import { PerfisComponent } from '@/pages/perfis/perfis.component';
import { authGuard } from '@/pages/auth/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: HomeComponent,
                canActivate: [authGuard]
            },
            {
                path: 'usuarios',
                component: UsuariosComponent,
                data: { breadcrumb: 'Usuários' },
                canActivate: [authGuard]
            },
            {
                path: 'perfis',
                component: PerfisComponent,
                data: { breadcrumb: 'Perfis' },
                canActivate: [authGuard]
            }
        ]
    },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes').then(r => r.routes) },
    { path: '**', component: NotfoundComponent }
];
