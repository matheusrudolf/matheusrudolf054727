import { AfterViewInit, Component, ContentChild, ContentChildren, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges } from '@angular/core';
import { DatagridColumnComponent } from './components/datagrid-column/datagrid-columns.component';
import { DatagridColumnActionsComponent } from './components/datagrid-column/components/datagrid-column-actions/datagrid-column-actions.component';
import { DatagridToolbarComponent } from './components/datagrid-toolbar/datagrid-toolbar.component';
import { DatagridColumnType } from '@/shared/models/components/datagrid-column';
import { StringUtils } from '@/shared/utils/string.util';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { AbstractService } from '@/core/abstract.service';
import { Pageable } from '@/shared/classes/pageable';
import { finalize } from 'rxjs';
import { MessageUtil } from '@/shared/utils/message.util';
import { Entity } from '@/shared/models/entity';

@Component({
    selector: 'scx-datagrid',
    standalone: false,
    template: `
        <p-table #dt [value]="page.dados" [columns]="genericColumns" [size]="size" [showGridlines]="showGridlines"
            [stripedRows]="stripedRows" [resizableColumns]="resizableColumns" [sortMode]="sortMode"
            [(selection)]="selectedRows" rowHover [tableStyle]="{ width }" (selectionChange)="onSelectionChange.emit({ $event, ctx })">
            @if (toolbar && toolbar.enabled) {
                <ng-template #caption>
                    <app-toolbar-container [toolbar]="toolbar" [allowEdit]="allowEdit"
                        [allowSelection]="allowSelection" [columns]="columns" [selectedColumns]="selectedColumns"
                        [selectedRows]="selectedRows" [width]="width" />
                </ng-template>
            }
            <ng-template #header>
                <tr>
                    @if (allowSelection) {
                        <th pResizableColumn style="width: 4rem"><p-tableHeaderCheckbox /></th>
                    }
                    @for (column of datagridColumns; track $index) {
                        @if (column.type !== 'action' && column.visible) {
                            @if (sort && column.sortable) {
                                <th pResizableColumn [pSortableColumn]="column.field" [style]="{ width: column.width }">
                                    <div class="flex item-center gap-2">
                                        {{ column.header }}
                                        @if (sort && column.sortable) {
                                            <p-sortIcon [field]="column.field" />
                                        }
                                    </div>
                                </th>
                            } @else {
                                <th pResizableColumn [style]="{ width: column.width }"> {{ column.header }} </th>
                            }
                        }
                    }
                    @if (hasCustomActions || allowEdit) {
                        <th pResizableColumn style="text-align: center;"> Ações </th>
                    }
                </tr>
            </ng-template>
            <ng-template #body let-rowData>
                <tr>
                    @if (allowSelection) {
                        <td><p-tableCheckbox [value]="rowData" /></td>
                    }
                    @for (column of datagridColumns; track $index) {
                        @if (column.type !== 'action' && column.visible) {
                            <td [style]="{ 'text-align': column.alignment }"> {{ rowData[column.field] }} </td>
                        }
                    }
                    @if (hasCustomActions || allowEdit) {
                        @if (hasCustomActions) {
                            <td>
                                <div class="flex justify-center gap-2">
                                    @for (action of actionsColumns; track $index) {
                                        @switch (action.name) {
                                            @case ('update') {
                                                <p-button icon="pi pi-pencil" severity="secondary" pTooltip="Editar" text rounded />
                                            }
                                            @case ('delete') {
                                                <p-button icon="pi pi-trash" severity="danger" pTooltip="Remover"
                                                    (onClick)="handleDeleteEntity(rowData)" text rounded />
                                            }
                                        }
                                        <p-button [label]="action.label" [icon]="'pi pi-' + action.icon" [severity]="action.severity"
                                            [pTooltip]="action.tooltip" (onClick)="action.onClick.emit(rowData)" text rounded />
                                    }
                                </div>
                            </td>
                        } @else {
                            <td>
                                <div class="flex justify-center gap-2">
                                    <p-button icon="pi pi-pencil" severity="secondary" pTooltip="Editar"
                                        text rounded />
                                    <p-button icon="pi pi-trash" severity="danger" pTooltip="Remover"
                                        (onClick)="handleDeleteEntity(rowData)" text rounded />
                                </div>
                            </td>
                        }
                    }
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td [attr.colspan]="columns.length + 2">
                        <p class="font-bold text-center p-6">Nenhum Resultado Encontrado.</p>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
})
export class DatagridComponent<T> implements OnInit, AfterViewInit, OnChanges {
    public readonly service = inject(AbstractService<T, T>);
    public readonly ctx: DatagridComponent<T> = this;

    private readonly stringUtils = new StringUtils;
    private readonly dialogUtils = inject(DialogUtil);
    private readonly messageUtils = inject(MessageUtil);

    @ContentChild(DatagridToolbarComponent) toolbar?: DatagridToolbarComponent;
    @ContentChildren(DatagridColumnComponent) columns!: QueryList<DatagridColumnComponent>;

    @Input() datasource: AbstractService<T, T>;
    @Input() size!: 'small' | 'large';
    @Input() showGridlines: boolean = false;
    @Input() stripedRows: boolean = false;
    @Input() allowEdit: boolean = false;
    @Input() allowSelection: boolean = false;
    @Input() sort: boolean = false;
    @Input() resizableColumns: boolean = false;
    @Input() sortMode: 'single' | 'multiple' = 'single';
    @Input() width!: string;

    @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCustomAction: EventEmitter<void> = new EventEmitter<void>();

    get hasCustomActions(): boolean {
        const actionColumn = this.columns.find(col => col.type === 'action');
        return (actionColumn?.actions.length > 0) || false;
    }

    get actionsColumns(): QueryList<DatagridColumnActionsComponent> {
        const actionColumn = this.columns.find(col => col.actions.length > 0);
        return actionColumn.actions;
    }

    get datagridColumns() {
        const column = this.columns.length > 0 ? this.columns : this.genericColumns;
        return column;
    }

    public page: Pageable<T> = new Pageable<T>();
    public genericColumns: DatagridColumnType[] = [];
    public loading: boolean = false;
    public selectedColumns: DatagridColumnType[] = [];
    public selectedRows: T[] = [];

    ngOnInit(): void {
        this.handleGetRequest();
    }

    ngAfterViewInit(): void {
        const columnsArray = this.columns.filter(c => c.type !== 'action');
        this.selectedColumns = columnsArray.filter(c => c.visible);
    }

    ngOnChanges(_changes: SimpleChanges): void {
        if (this.page.dados?.length > 0) {
            const fields = Object.keys(this.page.dados[0]);
            fields.forEach(field => {
                this.genericColumns.push({ field, header: this.stringUtils.captilizeStrings(field), visible: true });
            });
        }
    }

    public handleGetRequest(): void {
        const params = new Map<string, any>();

        this.loading = true;
        this.datasource.listPageable(params, this.page)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (page) => this.page = page,
                error: (err) => console.error(err.error)
            });
    }

    public handleDeleteEntity(rowData: Entity): void {
        this.dialogUtils.confirmRemoveDialog(() => {
            this.service.delete(rowData.id)
                .pipe(finalize(() => this.loading = false))
                .subscribe({
                    next: (res) => {
                        if (this.hasCustomActions) this.onCustomAction.emit();
                        this.messageUtils.success(res.mensagem, 'Sucesso');
                        this.handleGetRequest();
                    },
                    error: (err) => this.messageUtils.success(err.error.mensagem, 'Erro')
                });
        });
    }
}
