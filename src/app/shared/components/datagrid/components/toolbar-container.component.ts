import { Component, Input, OnChanges, QueryList, SimpleChanges } from "@angular/core";
import { DatagridToolbarComponent } from "./datagrid-toolbar/datagrid-toolbar.component";
import { TOOLBARCONTAINER_IMPORTS } from "./datagrid-toolbar/toolbar-container.imports";
import { MenuItem } from "primeng/api";
import { Columns3Cog } from 'lucide-angular';
import { DatagridColumnType } from "@/shared/models/components/datagrid-column";
import { DatagridColumnComponent } from "./datagrid-column/datagrid-columns.component";

@Component({
    selector: 'app-toolbar-container',
    standalone: true,
    imports: [TOOLBARCONTAINER_IMPORTS],
    template: `
        <div class="flex justify-between" [style]="{ width }">
            @if (toolbar.items.length > 0) {
                @for (group of toolbarGroups; track group.align) {
                    <div class="flex" [ngClass]="group.align">
                        <div [ngClass]="hasItemsLocatedInMenu(group) ? 'hidden md:flex gap-2' : ''">
                            @for (item of group.items; track $index) {
                                @if (!item.name) {
                                    @switch (item.widget) {
                                        @case ('button') {
                                            <p-button [label]="item.label" [icon]="'pi pi-' + item.icon" [severity]="item.severity"
                                                [pTooltip]="item.tooltip" [disabled]="item.disabled" (onClick)="item.command.emit()"
                                                text rounded />
                                        }
                                        @case ('inputtext') {
                                            <p-floatlabel>
                                                <input type="text" pInputText fluid />
                                                <label> {{ item.label }} </label>
                                            </p-floatlabel>
                                        }
                                    }
                                } @else {
                                    @switch (item.name) {
                                        @case ('columnChooser') {
                                            <p-button severity="secondary" variant="text" rounded
                                                pTooltip="Seletor de Colunas" (onClick)="op.toggle($event)">
                                                <ng-template #icon>
                                                    <lucide-icon [img]="icons.Columns3Cog" size="20"></lucide-icon>
                                                </ng-template>
                                            </p-button>
                                        }
                                        @case ('search') {
                                            <p-iconfield>
                                                <p-inputicon class="pi pi-search" />
                                                <input type="text" pInputText placeholder="Buscar..." />
                                            </p-iconfield>
                                        }
                                        @case ('add') {
                                            <p-button icon="pi pi-plus" severity="secondary" text rounded
                                                pTooltip="Adicionar novo registro" />
                                        }
                                        @case ('delete') {
                                            <p-button icon="pi pi-trash" severity="danger" text rounded
                                                [disabled]="selectedRows.length === 0" pTooltip="Excluir registros selecionados" />
                                        }
                                        @case ('export') {
                                            <p-splitbutton [model]="exportMenu" icon="pi pi-print" severity="secondary" text
                                                pTooltip="Exportar registros" />
                                        }
                                    }
                                }
                            }
                        </div>
                    </div>
                }
            } @else {
                <div class="flex justify-start gap-2">
                    @if (toolbar.allowColumnChoose) {
                        <p-button severity="secondary" text rounded pTooltip="Seletor de Colunas"
                            (onClick)="op.toggle($event)">
                            <ng-template #icon>
                                <lucide-icon [img]="icons.Columns3Cog" size="20"></lucide-icon>
                            </ng-template>
                        </p-button>
                    }
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input type="text" pInputText placeholder="Buscar..." />
                    </p-iconfield>
                </div>
                <div class="flex justify-end">
                    <div class="hidden md:flex gap-2">
                        @if (allowEdit) {
                            @if (toolbar.allowAdd) {
                                <p-button icon="pi pi-plus" severity="secondary" text rounded
                                    pTooltip="Adicionar novo registro" />
                            }
                            @if (allowSelection && toolbar.allowDelete) {
                                <p-button icon="pi pi-trash" severity="danger" text rounded
                                    [disabled]="selectedRows.length === 0" pTooltip="Excluir registros selecionados" />
                            }
                        }
                        @if (toolbar.allowExport) {
                            <p-splitbutton [model]="exportMenu" icon="pi pi-print" severity="secondary" text
                                pTooltip="Exportar registros" />
                        }
                    </div>
                </div>
            }
            <div class="flex md:hidden">
                <p-button icon="pi pi-ellipsis-v" severity="secondary" (onClick)="menu.toggle($event)"
                    text rounded/>
                <p-tieredmenu #menu [model]="menuItens" [popup]="true" appendTo="body" />
            </div>
        </div>

        <p-popover #op [dismissable]="false" [style]="{ width: '20rem' }">
            <div class="flex flex-col gap-2 p-4">
                <h5 style="margin: 0;" class="font-semibold">Seletor de Colunas</h5>
                <p-multiselect display="chip" [options]="columnsArray" [(ngModel)]="selectedColumns" optionLabel="header"
                    selectedItemsLabel="{0} colunas selecionadas" [style]="{ 'min-width': '200px' }"
                    placeholder="Selecione..." (onChange)="handleColumnToggle()" />
            </div>
        </p-popover>
    `
})
export class ToolbarContainerComponent<T> implements OnChanges {
    public readonly icons = { Columns3Cog };

    @Input() toolbar: DatagridToolbarComponent;
    @Input() allowEdit!: boolean;
    @Input() allowSelection: boolean = false;
    @Input() columns: QueryList<DatagridColumnComponent>;
    @Input() selectedColumns: DatagridColumnType[];
    @Input() selectedRows!: T[];
    @Input() width!: string;

    public columnsArray: DatagridColumnType[];

    get toolbarGroups() {
        return [
            { align: 'justify-start', items: this.toolbar.beforeItems },
            { align: 'justify-end', items: this.toolbar.afterItems }
        ];
    }

    public menuItens: MenuItem[] = [];
    public exportMenu: MenuItem[] = [];

    ngOnChanges(_changes: SimpleChanges): void {
        this.exportMenu = this.handleBuildExportMenuFactory();

        this.toolbar.items.forEach(item => {
            if (item.widget === 'button') {
                this.menuItens.push({
                    label: item.menuLabel,
                    icon: `pi pi-${item.icon}`,
                    command: () => item.command.emit()
                });
            }
        });

        if (this.toolbar.items.length === 0) {
            this.menuItens = [
                {
                    label: 'Adicionar novo registro',
                    icon: 'pi pi-plus',
                    // command: () => this.onOpenForm.emit({ visible: true, state: CrudStateEnum.add, formData: null })
                },
                {
                    label: 'Excluir registros selecionados',
                    icon: 'pi pi-trash',
                    disabled: this.selectedRows.length === 0,
                    // command: () => this.handleDeleteSelectedRows()
                },
                {
                    label: 'Exportar',
                    icon: 'pi pi-print',
                    items: this.handleBuildExportMenuFactory()
                }
            ];
        }

        this.columnsArray = this.columns.filter(column => column.type !== 'action');
    }

    public hasItemsLocatedInMenu(group: any): boolean {
        return group.items?.some((item: any) => item.locateInMenu);
    }

    public handleColumnToggle(): void {
        this.columns.forEach(column => column.visible = this.selectedColumns.some(sel => sel.field === column.field));
    }

    private handleBuildExportMenuFactory(): MenuItem[] {
        return [
            { icon: 'pi pi-file-excel', label: 'Exportar dados em XLSX', command: () => {} },
            { icon: 'pi pi-file-excel', label: 'Exportar dados selecionados em XLSX', command: () => {} },
            { separator: true },
            { icon: 'pi pi-file-pdf', label: 'Exportar dados em PDF', command: () => {} },
            { icon: 'pi pi-file-pdf', label: 'Exportar dados selecionados em PDF', command: () => {} },
        ];
    }
}
