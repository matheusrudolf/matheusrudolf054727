import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';

// 1. IMPORTS DE COMPONENTES ANINHADOS
import { UsuariosToolbarComponent } from './components/usuarios-toolbar/usuarios-toolbar.component';
import { UsuariosFilterComponent } from './components/usuarios-filter/usuarios-filter.component';
import { UsuariosFormComponent } from './components/usuarios-form/usuarios-form.component';

export const USUARIOS_IMPORTS = [
    TableModule,
    ButtonModule,
    TooltipModule,
    PaginatorModule
];

export const NESTED_IMPORTS = [
    UsuariosToolbarComponent,
    UsuariosFilterComponent,
    UsuariosFormComponent
]
