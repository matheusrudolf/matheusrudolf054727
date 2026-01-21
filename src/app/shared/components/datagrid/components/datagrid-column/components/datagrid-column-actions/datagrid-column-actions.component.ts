import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DatagridColumnComponent } from '../../datagrid-columns.component';

@Component({
    selector: 'sci-action',
    standalone: false,
    template: ``
})
export class DatagridColumnActionsComponent {
    @Input() label!: string;
    @Input() icon!: string;
    @Input() severity: 'primary' | 'secondary' | 'info' | 'warn' | 'danger' | 'help' = 'primary';
    @Input() tooltip!: string;
    @Input() name!: 'update' | 'delete';

    @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

    public readonly column = inject(DatagridColumnComponent, { optional: true });
}
