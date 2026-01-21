import { DatagridColumnType } from '@/shared/models/components/datagrid-column';
import { Pageable } from '@/shared/classes/pageable';
import { Component, inject, OnInit } from '@angular/core';
import { UsuariosService } from '@/core/usuarios.service';
import { finalize } from 'rxjs';
import { Usuarios } from '@/shared/models/usuarios';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { FormStateType } from '@/shared/models/components/form-state';
import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { PaginatorState } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { UsuariosUtil } from './utils/usuarios.util';

// 1. IMPORTAÇÃO DA CONSTANTE DE IMPORTS
import { USUARIOS_IMPORTS, NESTED_IMPORTS } from './usuarios.imports';

@Component({
    selector: 'app-usuarios',
    standalone: true,
    // 2. USO DA CONSTANTE NO ARRAY 'imports'
    imports: [USUARIOS_IMPORTS, NESTED_IMPORTS],
    template: `
        <p-table #dt [value]="page.dados" [columns]="columns" [resizableColumns]="true" [loading]="loading"
            [(selection)]="selectedRows" [lazy]="true" stripedRows rowHover (onSort)="handleSortColumn($event, dt)">
            <ng-template #caption>
                <app-usuarios-toolbar [datasource]="page.dados" [columns]="columns" [selectedColumns]="selectedColumns"
                    [selectedRows]="selectedRows" (onGlobalSearchFilter)="handleGlobalSearchApply($event)"
                    (onOpenForm)="formProperties = $event" />
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 4rem"><p-tableHeaderCheckbox /></th>
                    @for (col of columns; track $index) {
                        @if (col.visible) {
                            <th pResizableColumn [pSortableColumn]="col.field">
                                {{ col.header }}
                                <p-sortIcon [field]="col.field" />
                            </th>
                        }
                    }
                    <th style="text-align: center;">Ações</th>
                </tr>
            </ng-template>
            <ng-template #body let-rowData>
                <tr>
                    <td><p-tableCheckbox [value]="rowData" /></td>
                    @for (col of columns; track $index) {
                        @if (col.visible) {
                            <td> {{ rowData[col.field] }} </td>
                        }
                    }
                    <td>
                        <div class="flex justify-center gap-2">
                            <p-button icon="pi pi-search" severity="secondary" variant="text" rounded
                                pTooltip="Detalhes" (onClick)="formProperties = { visible: true, state: CrudStateEnum.view, formData: rowData }" />
                            <p-button icon="pi pi-pencil" severity="secondary" variant="text" rounded
                                pTooltip="Editar" (onClick)="formProperties = { visible: true, state: CrudStateEnum.edit, formData: rowData }" />
                            <p-button icon="pi pi-trash" severity="danger" variant="text" rounded
                                pTooltip="Remover" (onClick)="handleDeleteEntity(rowData)" />
                        </div>
                    </td>
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

        <p-paginator [rows]="page.size" [showCurrentPageReport]="true" [totalRecords]="page.total"
            [rowsPerPageOptions]="[10, 20, 30]" currentPageReportTemplate="Exibindo {first} à {last} de {totalRecords} registros"
            (onPageChange)="handlePageChange($event)" />

        @if (formProperties.visible) {
            <app-usuarios-form [visible]="formProperties.visible" [state]="formProperties.state"
                [formData]="formProperties.formData" (onCancelForm)="formProperties = $event" />
        }
    `
})
export class UsuariosComponent implements OnInit {
    private readonly usuariosService = inject(UsuariosService);

    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);
    private readonly usuariosUtil = new UsuariosUtil;

    public readonly CrudStateEnum = CrudStateEnum;

    public page: Pageable<Usuarios> = new Pageable<Usuarios>();
    public columns: DatagridColumnType[] = this.usuariosUtil.columnBuildFactory();
    public selectedRows: Usuarios[] = [];
    public loading: boolean = false;
    public selectedColumns: DatagridColumnType[] = [];
    public formProperties: FormStateType<Usuarios> = { visible: false, state: CrudStateEnum.none, formData: null };

    private sortCount: number = null;

    ngOnInit(): void {
        this.selectedColumns = this.columns.filter(c => c.visible);
        this.handleGetRequest();
    }

    public handleGetRequest(filter?: any, sort?: any): void {
        const params = new Map<string, any>();

        if (filter) params.set('filter', filter);
        if (sort) params.set('sortField', sort.field);
        if (sort) params.set('sortOrder', sort.order);

        this.loading = true;
        this.usuariosService.listPageable(params, this.page)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (page) => this.page = page,
                error: (err) => console.error(err.error)
            });
    }

    public handleGlobalSearchApply(search: string): void {
        this.handleGetRequest(search);
    }

    public handleDeleteEntity(rowData: Usuarios): void {
        this.dialogUtil.confirmRemoveDialog(() => {
            this.usuariosService.delete(rowData.id)
                .pipe(finalize(() => this.loading = false))
                .subscribe({
                    next: (res) => {
                        this.messageUtil.success(res.mensagem, 'Sucesso')
                        this.handleGetRequest();
                    },
                    error: (err) => this.messageUtil.success(err.error.mensagem, 'Erro')
                });
        });
    }

    public handlePageChange(event: PaginatorState): void {
        this.page = { ...this.page, size: event.rows, page: event.page };
        this.handleGetRequest();
    }

    public handleSortColumn(event: any, dt: Table): void {
        this.sortCount++;

        const sort = this.sortCount >= 3
            ? (this.sortCount = 0, dt.reset(), undefined)
            : { field: event.field, order: event.order };

        this.handleGetRequest(undefined, sort);
    }
}
