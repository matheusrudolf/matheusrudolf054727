import { DatagridColumnType } from '@/shared/models/components/datagrid-column';
import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Columns3Cog } from 'lucide-angular';
import { MenuItem } from 'primeng/api';
import { ExportService } from '@/core/export.service';
import { debounceTime, Subject } from 'rxjs';
import { <%= classify(name) %> } from '@/shared/models/<%= dasherize(name) %>';
import { FormStateType } from '@/shared/models/components/form-state';
import { <%= classify(name) %>Service } from '@/core/<%= dasherize(name) %>.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { <%= classify(name) %>Component } from '../../<%= dasherize(name) %>.component';

// 1. IMPORTAÇÃO DA CONSTANTE DE IMPORTS
import { <%= underscore(name).toUpperCase() %>_TOOLBAR_IMPORTS } from './<%= dasherize(name) %>-toolbar.imports';

@Component({
    selector: 'app-<%= dasherize(name) %>-toolbar',
    standalone: true,
    // 2. USO DA CONSTANTE NO ARRAY 'imports'
    imports: [<%= underscore(name).toUpperCase() %>_TOOLBAR_IMPORTS],
    template: `
        <div class="flex justify-between">
            <div class="flex justify-start gap-2">
                <p-button severity="secondary" variant="text" rounded
                    pTooltip="Seletor de Colunas" (onClick)="op.toggle($event)">
                    <ng-template #icon>
                        <lucide-icon [img]="icons.Columns3Cog" size="20"></lucide-icon>
                    </ng-template>
                </p-button>
                <p-iconfield>
                    <p-inputicon class="pi pi-search" />
                    <input type="text" pInputText placeholder="Buscar..." [(ngModel)]="globalSearch"
                        (ngModelChange)="filterSubject$.next(this.globalSearch)" />
                </p-iconfield>
            </div>
            <div class="flex justify-end gap-2">
                <p-button icon="pi pi-plus" severity="secondary" variant="text" rounded
                    (onClick)="onOpenForm.emit({ visible: true, state: CrudStateEnum.add, formData: null })"
                    pTooltip="Adicionar novo registro" />
                <p-button icon="pi pi-trash" severity="danger" variant="text" rounded
                    [disabled]="selectedRows.length === 0" pTooltip="Excluir registros selecionados"
                    (onClick)="handleDeleteSelectedRows()" />
                <p-splitbutton [model]="exportMenu" icon="pi pi-print" severity="secondary" text
                    pTooltip="Exportar registros" />
            </div>
        </div>

        <p-popover #op [dismissable]="false" [style]="{ width: '20rem' }">
            <div class="flex flex-col gap-2 p-4">
                <h5 style="margin: 0;" class="font-semibold">Seletor de Colunas</h5>
                <p-multiselect display="chip" [options]="columns" [(ngModel)]="selectedColumns" optionLabel="header"
                    selectedItemsLabel="{0} colunas selecionadas" [style]="{ 'min-width': '200px' }" placeholder="Selecione..."
                    (onChange)="handleColumnToggle()" />
            </div>
        </p-popover>
  `
})
export class <%= classify(name) %>ToolbarComponent implements OnChanges {
    private readonly <%= dasherize(name) %>Service = inject(<%= classify(name) %>Service);
    private exportService = inject(ExportService);

    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);
    private readonly <%= dasherize(name) %> = inject(<%= classify(name) %>Component);

    public readonly icons = { Columns3Cog };
    public readonly CrudStateEnum = CrudStateEnum;

    @Input() datasource: <%= classify(name) %>[];
    @Input() columns: DatagridColumnType[];
    @Input() selectedColumns: DatagridColumnType[];
    @Input() selectedRows: <%= classify(name) %>[];

    @Output() onGlobalSearchFilter: EventEmitter<string> = new EventEmitter<string>();
    @Output() onOpenForm: EventEmitter<FormStateType<<%= classify(name) %>>> = new EventEmitter<FormStateType<<%= classify(name) %>>>();

    public exportMenu: MenuItem[] = [];
    public filterSubject$ = new Subject<any>();
    public globalSearch: string = '';

    constructor() {
        this.filterSubject$.pipe(debounceTime(500)).subscribe(filters => this.onGlobalSearchFilter.emit(filters));
    }

    ngOnChanges(_changes: SimpleChanges): void {
        this.handleBuildExportMenu();
    }

    public handleColumnToggle(): void {
        this.columns.forEach(column => column.visible = this.selectedColumns.some(sel => sel.field === column.field));
    }

    private handleBuildExportMenu(): void {
        this.exportMenu = [
            { icon: 'pi pi-file-excel', label: 'Exportar dados em XLSX', command: () => this.exportService.exportExcel(this.datasource, '<%= dasherize(name) %>') },
            { icon: 'pi pi-file-excel', label: 'Exportar dados selecionados em XLSX', disabled: this.selectedRows.length === 0, command: () => this.exportService.exportExcel(this.selectedRows, '<%= dasherize(name) %>') },
            { separator: true },
            { icon: 'pi pi-file-pdf', label: 'Exportar dados em PDF', command: () => this.exportService.exportPdf(this.columns, this.datasource, '<%= dasherize(name) %>') },
            { icon: 'pi pi-file-pdf', label: 'Exportar dados selecionados em PDF', disabled: this.selectedRows.length === 0, command: () => this.exportService.exportPdf(this.columns, this.selectedRows, '<%= dasherize(name) %>') },
        ];
    }

    public handleDeleteSelectedRows(): void {
        const ids = this.selectedRows.map(row => row.id);

        this.dialogUtil.confirmRemoveAllDialog(() => {
            this.<%= dasherize(name) %>Service.deleteSelected(ids).subscribe({
                next: (res) => {
                    this.messageUtil.success(res.mensagem, 'Sucesso');
                    this.<%= dasherize(name) %>.handleGetRequest();
                }
            })
        })
    }
}
