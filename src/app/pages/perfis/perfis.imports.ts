import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';

// 1. IMPORTS DE COMPONENTES ANINHADOS
import { PerfisToolbarComponent } from './components/perfis-toolbar/perfis-toolbar.component';
import { PerfisFilterComponent } from './components/perfis-filter/perfis-filter.component';
import { PerfisFormComponent } from './components/perfis-form/perfis-form.component';

export const PERFIS_IMPORTS = [
    TableModule,
    ButtonModule,
    TooltipModule,
    PaginatorModule
];

export const NESTED_IMPORTS = [
    PerfisToolbarComponent,
    PerfisFilterComponent,
    PerfisFormComponent
]
