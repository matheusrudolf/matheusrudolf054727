import { CrudStateEnum } from './../../enums/crud-state.enum';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DATAGRID_EDIT_IMPORTS } from './datagrid-edit.imports';
import { Table } from 'primeng/table';
import { DatagridColumnType } from '@/shared/models/components/datagrid-column';
import { AbstractService } from '@/core/abstract.service';
import { StringUtils } from '@/shared/utils/string.util';

@Component({
    selector: 'app-datagrid-edit',
    standalone: true,
    imports: [DATAGRID_EDIT_IMPORTS],
    template: `
        <p-table #dt [value]="datasource" [columns]="columns" size="small" editMode="row" dataKey="id" stripedRows rowHover>
            <ng-template #caption>
                <div class="flex justify-end gap-2">
                    <p-button icon="pi pi-plus" severity="secondary" variant="text" rounded
                        (onClick)="onAddNewRow(dt); state = CrudStateEnum.add" [disabled]="readOnly"
                        pTooltip="Adicionar novo registro" />
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 4rem"><p-tableHeaderCheckbox [disabled]="readOnly" /></th>
                    @for (col of columns; track $index) {
                        <th> {{ col.header }} </th>
                    }
                    <th style="text-align: center;">Ações</th>
                </tr>
            </ng-template>
            <ng-template #body let-rowData let-editing="editing" let-ri="rowIndex">
                <tr [pEditableRow]="rowData">
                    <td><p-tableCheckbox [value]="rowData" [disabled]="readOnly" /></td>
                    @for (col of columns; track $index) {
                        <td>
                            @if (col.field !== 'id') {
                                <p-cellEditor>
                                    <ng-template #input>
                                        <p-select [options]="options" [(ngModel)]="rowData[col.field]" [optionLabel]="col.field"
                                            [optionValue]="col.field" fluid appendTo="body">
                                        </p-select>
                                    </ng-template>
                                    <ng-template #output>
                                        {{ rowData[col.field] }}
                                    </ng-template>
                                </p-cellEditor>
                            } @else {
                                {{ rowData[col.field] }}
                            }
                        </td>
                    }
                    <td>
                        <div class="flex justify-center">
                            @if (!editing) {
                                <p-button icon="pi pi-pencil" pInitEditableRow severity="secondary"
                                variant="text" rounded (onClick)="state = CrudStateEnum.edit" [disabled]="readOnly"
                                    pTooltip="Editar" />
                                <p-button icon="pi pi-trash" severity="danger" variant="text" rounded
                                    (onClick)="handleDeleteData(rowData)" [disabled]="readOnly"
                                        pTooltip="Remover" />
                            } @else {
                                <p-button icon="pi pi-check" pSaveEditableRow severity="secondary"
                                    variant="text" rounded (onClick)="handleSaveData(rowData)"
                                        pTooltip="Confirmar" />
                                <p-button icon="pi pi-times" pCancelEditableRow severity="danger"
                                    variant="text" rounded (onClick)="handleCancelEdit(rowData)"
                                        pTooltip="Cancelar" />
                            }
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
    `
})
export class DatagridEditComponent implements OnChanges {
    public readonly CrudStateEnum = CrudStateEnum;

    private readonly stringUtils = new StringUtils;

    @Input() datasource: any[];
    @Input() fields: string[];
    @Input() injection: AbstractService<any, any>;
    @Input() readOnly: boolean;

    @Output() onSavingData: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() onRemovingData: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() onSelectedData: EventEmitter<any[]> = new EventEmitter<any[]>();

    public columns: DatagridColumnType[] = [];
    public state!: CrudStateEnum;
    public selectedRows: any[] = [];
    public loading: boolean = false;
    public options: any[] = [];

    ngOnChanges(_changes: SimpleChanges): void {
        this.handleGetFieldList();

        this.fields.forEach(field => {
            this.columns.push({ field: field, header: this.stringUtils.captilizeStrings(field), visible: true });
        });
    }

    public onAddNewRow(dt: Table): void {
        const newRow: any = Object.fromEntries(this.columns.map(c => [c.field, '']));
        newRow.id = 0;

        this.datasource.push(newRow);
        dt.initRowEdit(newRow);
    }

    public handleCancelEdit(rowData: any): void {
        if (rowData.id === 0) this.datasource.pop();
    }

    private handleGetFieldList(): void {
        this.injection.listAll().subscribe({
            next: (res) => this.options = res.dados,
            error: (err) => console.error(err)
        });
    }

    public handleSaveData(rowData: any): void {
        const field = Object.keys(rowData).find(key => key !== 'id' && this.fields.includes(key));
        const value = this.options.find(option => option[field] === rowData[field]);

        rowData.id = value.id;
        rowData[field] = value[field];

        this.onSavingData.emit(this.datasource);
    }

    public handleDeleteData(rowData: any): void {
        const index = this.datasource.findIndex(data => data.id === rowData.id);
        this.datasource.splice(index, 1);

        this.onRemovingData.emit(this.datasource);
    }
}
