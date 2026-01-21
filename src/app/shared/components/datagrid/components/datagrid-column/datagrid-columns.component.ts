import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { DatagridColumnActionsComponent } from './components/datagrid-column-actions/datagrid-column-actions.component';

@Component({
    selector: 'sci-datagrid-column',
    standalone: false,
    template: `
        @if (type === 'action') {
            <ng-content />
        }
    `
})
export class DatagridColumnComponent {
    @Input() field!: string;
    @Input() header!: string;
    @Input() width!: string;
    @Input() type: 'data' | 'action' = 'data';
    @Input() visible: boolean = true;
    @Input() sortable: boolean = true;
    @Input() alignment: 'left' | 'center' | 'right' = 'left';
    @Input() dataType!: 'string' | 'number' | 'date' | 'boolean';

    @ContentChildren(DatagridColumnActionsComponent)
    actions!: QueryList<DatagridColumnActionsComponent>;
}
