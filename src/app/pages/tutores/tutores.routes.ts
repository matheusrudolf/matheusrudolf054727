import { Routes } from "@angular/router";
import { authGuard } from "../auth/auth.guard";
import { TutoresComponent } from "./tutores.component";

export const tutoresRoutes: Routes = [
    {
        path: '',
        component: TutoresComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Tutores' },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                loadComponent: () =>
                    import('./features/tutores-list/tutores-list.component')
                        .then(c => c.TutoresListComponent),
                data: { breadcrumb: 'Listagem' }
            },
            {
                path: 'add',
                loadComponent: () =>
                    import('./features/tutores-register/tutores-register.component')
                        .then(c => c.TutoresRegisterComponent),
                data: { breadcrumb: 'Adicionar' }
            },
            {
                path: 'edit/:id',
                loadComponent: () =>
                    import('./features/tutores-register/tutores-register.component')
                        .then(c => c.TutoresRegisterComponent),
                data: { breadcrumb: 'Editar' }
            }
        ]
    }
];
