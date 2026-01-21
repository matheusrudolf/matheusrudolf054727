import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';

// 1. IMPORTS DE COMPONENTES ANINHADOS
import { <%= classify(name) %>ToolbarComponent } from './components/<%= dasherize(name) %>-toolbar/<%= dasherize(name) %>-toolbar.component';
import { <%= classify(name) %>FilterComponent } from './components/<%= dasherize(name) %>-filter/<%= dasherize(name) %>-filter.component';
import { <%= classify(name) %>FormComponent } from './components/<%= dasherize(name) %>-form/<%= dasherize(name) %>-form.component';

export const <%= underscore(name).toUpperCase() %>_IMPORTS = [
    TableModule,
    ButtonModule,
    TooltipModule,
    PaginatorModule
];

export const NESTED_IMPORTS = [
    <%= classify(name) %>ToolbarComponent,
    <%= classify(name) %>FilterComponent,
    <%= classify(name) %>FormComponent
]
