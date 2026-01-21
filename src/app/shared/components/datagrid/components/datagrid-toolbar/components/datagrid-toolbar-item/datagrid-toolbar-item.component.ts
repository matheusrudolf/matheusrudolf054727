import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'sci-datagrid-toolbar-item',
    standalone: false,
    template: ``
})
export class DatagridToolbarItemComponent {
    @Input() name!: 'add' | 'delete' | 'export' | 'search' | 'columnChooser';
    @Input() location: 'before' | 'after' = 'after';
    @Input() widget: 'button' | 'inputtext' = 'button';
    @Input() label!: string;
    @Input() menuLabel!: string;
    @Input() disabled: boolean = false;
    @Input() locateInMenu: boolean = true;

    // Button
    @Input() icon!: string;
    @Input() severity: 'primary' | 'secondary' | 'info' | 'warn' | 'danger' | 'help' = 'primary';
    @Input() tooltip!: string;

    @Output() command: EventEmitter<void> = new EventEmitter<void>();
}
