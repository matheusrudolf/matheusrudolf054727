import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { DatagridToolbarItemComponent } from './components/datagrid-toolbar-item/datagrid-toolbar-item.component';

@Component({
    selector: 'sco-datagrid-toolbar',
    standalone: false,
    template: ``
})
export class DatagridToolbarComponent {
    @ContentChildren(DatagridToolbarItemComponent) items!: QueryList<DatagridToolbarItemComponent>;

    @Input() enabled: boolean = false;
    @Input() allowAdd: boolean = true;
    @Input() allowDelete: boolean = true;
    @Input() allowExport: boolean = true;
    @Input() allowColumnChoose: boolean = true;

    get beforeItems() {
        return this.items?.filter(i => i.location === 'before') ?? [];
    }

    get afterItems() {
        return this.items?.filter(i => i.location === 'after') ?? [];
    }
}
