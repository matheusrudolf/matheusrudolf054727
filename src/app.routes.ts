import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { NotfoundComponent } from '@/pages/notfound/notfound.component';
import { authGuard } from '@/pages/auth/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                loadChildren: () => import('./app/pages/pets/pets.routes').then(r => r.petsRoutes),
                canActivate: [authGuard]
            }
        ]
    },
    { path: 'autenticacao', loadChildren: () => import('./app/pages/auth/auth.routes').then(r => r.routes) },
    { path: '**', component: NotfoundComponent }
];
