import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DatagridComponent } from './datagrid.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { NgTemplateOutlet } from '@angular/common';
import { LucideAngularModule } from "lucide-angular";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DatagridColumnComponent } from './components/datagrid-column/datagrid-columns.component';
import { DatagridColumnActionsComponent } from './components/datagrid-column/components/datagrid-column-actions/datagrid-column-actions.component';
import { DatagridToolbarComponent } from './components/datagrid-toolbar/datagrid-toolbar.component';
import { DatagridToolbarItemComponent } from './components/datagrid-toolbar/components/datagrid-toolbar-item/datagrid-toolbar-item.component';
import { ToolbarContainerComponent } from './components/toolbar-container.component';

@NgModule({
    declarations: [
        DatagridComponent,
        DatagridToolbarComponent,
        DatagridToolbarItemComponent,
        DatagridColumnComponent,
        DatagridColumnActionsComponent
    ],
    imports: [
        NgTemplateOutlet,
        TableModule,
        ButtonModule,
        TooltipModule,
        LucideAngularModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        ToolbarContainerComponent
    ],
    exports: [
        DatagridComponent,
        DatagridToolbarComponent,
        DatagridToolbarItemComponent,
        DatagridColumnComponent,
        DatagridColumnActionsComponent
    ]
})
export class DatagridModule { }
