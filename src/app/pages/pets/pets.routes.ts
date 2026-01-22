import { Routes } from "@angular/router";
import { PetsComponent } from "./pets.component";
import { authGuard } from "../auth/auth.guard";

export const petsRoutes: Routes = [
    {
        path: '',
        component: PetsComponent,
        canActivate: [authGuard],
        data: { breadcrumb: 'Pets' },
        children: [
            {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                loadComponent: () =>
                    import('./features/pets-list/pets-list.component')
                        .then(c => c.PetsListComponent),
                data: { breadcrumb: 'Listagem' }
            },
            {
                path: 'detail/:id',
                loadComponent: () =>
                    import('./features/pets-details/pets-details.component')
                        .then(c => c.PetsDetailsComponents),
                data: { breadcrumb: 'Detalhes' }
            },
            {
                path: 'add',
                loadComponent: () =>
                    import('./features/pets-register/pets-register.component')
                        .then(c => c.PetsRegisterComponent),
                data: { breadcrumb: 'Adicionar' }
            },
            {
                path: 'edit/:id',
                loadComponent: () =>
                    import('./features/pets-register/pets-register.component')
                        .then(c => c.PetsRegisterComponent),
                data: { breadcrumb: 'Editar' }
            }
        ]
    }
];
