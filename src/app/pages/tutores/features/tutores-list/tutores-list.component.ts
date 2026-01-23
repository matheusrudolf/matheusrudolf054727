import { TutoresService } from '@/core/tutores.service';
import { Pageable } from '@/shared/classes/pageable';
import { DatagridColumnType } from '@/shared/models/components/datagrid-column';
import { Tutores } from '@/shared/models/tutores';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { debounceTime, finalize, Subject } from 'rxjs';
import { Router, RouterLink } from "@angular/router";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { TooltipModule } from 'primeng/tooltip';
import { TutoresFotoComponent } from './components/tutores-foto/tutores-foto.component';
import { TutoresVinculosComponent } from './components/tutores-vinculos/tutores-vinculos.component';

@Component({
    selector: 'app-tutores-list',
    standalone: true,
    imports: [
        FormsModule,
        RouterLink,
        TableModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        ButtonModule,
        PaginatorModule,
        TieredMenuModule,
        TooltipModule,
        TutoresFotoComponent,
        TutoresVinculosComponent
    ],
    template: `
        <p-table [value]="page.content" [columns]="columns" [loading]="loading" stripedRows rowHover
            class="p-datatable-responsive-stack">
            <ng-template #caption>
                <div class="flex justify-between">
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input type="text" pInputText placeholder="Buscar por Nome"
                            [(ngModel)]="search" (ngModelChange)="filterSubject$.next(search)" />
                    </p-iconfield>
                    <div class="hidden md:flex justify-end gap-2">
                        <p-button label="Novo" icon="pi pi-plus" [routerLink]="['/tutores', 'add']" />
                    </div>
                    <div class="flex md:hidden">
                        <p-button icon="pi pi-ellipsis-v" severity="secondary" text
                            rounded (onClick)="menu.toggle($event)" />
                        <p-tieredmenu #menu [model]="menuItens" [popup]="true" appendTo="body" />
                    </div>
                </div>
            </ng-template>
            <ng-template #header let-columns>
                <tr>
                    @for (col of columns; track col) {
                        <th>
                            {{ col.header }}
                        </th>
                    }
                    <th style="text-align: center;">Ações</th>
                </tr>
            </ng-template>
            <ng-template #body let-rowData let-columns="columns">
                    <tr>
                        @for (col of columns; track col) {
                            <td>
                                {{ rowData[col.field] }}
                            </td>
                        }
                        <td>
                            <div class="flex justify-center gap-2">
                                <p-button icon="pi pi-pencil" severity="secondary" pTooltip="Editar Tutor"
                                    text rounded [routerLink]="['/tutores', 'edit', rowData.id]" />
                                <p-button icon="pi pi-image" severity="secondary" pTooltip="Vincular Foto Tutor"
                                    text rounded (onClick)="handleOpenTutorFotoModal(rowData)" />
                                <p-button icon="pi pi-arrow-right-arrow-left" severity="secondary"
                                    pTooltip="Vincular Pet ao Tutor" text rounded
                                    (onClick)="handleOpenVinculosModal(rowData)" />
                                <p-button icon="pi pi-trash" severity="danger" text rounded
                                    (onClick)="handleRemoveTutor(rowData.id)" />
                            </div>
                        </td>
                    </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td colspan="6">
                        <p class="font-bold text-center p-6">Nenhum Resultado Encontrado.</p>
                    </td>
                </tr>
            </ng-template>
        </p-table>
        <p-paginator (onPageChange)="handlePageChanges($event)" [rows]="page.size" [totalRecords]="page.total"
            [rowsPerPageOptions]="[5, 10, 15, 20]" />
        <app-tutores-foto [visible]="tutorFotoVisible" [tutor]="tutor" (onCancel)="tutorFotoVisible = $event"
            (onRefresh)="handleGetTutores()" />
        <app-tutores-vinculos [visible]="vinculosVisible" [tutor]="tutor" (onCancel)="vinculosVisible = $event" />
    `
})
export class TutoresListComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly tutoresService = inject(TutoresService);

    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);

    public page: Pageable<Tutores> = new Pageable<Tutores>();
    public columns: DatagridColumnType[] = [
        { field: 'nome', header: 'Nome' },
        { field: 'email', header: 'E-mail' },
        { field: 'telefone', header: 'Tel.' },
        { field: 'endereco', header: 'Endereço' },
        { field: 'cpf', header: 'CPF' }
    ]

    public loading: boolean = false;
    public filterSubject$ = new Subject<any>();
    public search!: string;
    public menuItens: MenuItem[] = [];

    public tutorFotoVisible: boolean = false;
    public tutor!: Tutores;

    public vinculosVisible: boolean = false;

    constructor() {
        this.filterSubject$.pipe(debounceTime(500)).subscribe(() => this.handleGetTutores());
    }

    ngOnInit(): void {
        this.handleGetTutores();
        this.handleBuildTieredMenuItems();
    }

    public handleGetTutores(): void {
        const params = new Map<string, string>();

        if (this.search) params.set('nome', this.search);

        this.loading = true;
        this.tutoresService.listPageable(params, this.page)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (page) => this.page = page
            });
    }

    public handlePageChanges(event: PaginatorState): void {
        this.page.page = event.page;
        this.page.size = event.rows;
        this.handleGetTutores();
    }

    private handleBuildTieredMenuItems(): void {
        this.menuItens = [
            {
                label: 'Novo',
                icon: 'pi pi-plus',
                command: () => this.router.navigateByUrl('/tutores/add')
            }
        ];
    }

    public handleRemoveTutor(id: number): void {
        this.dialogUtil.confirmRemoveDialog(() => {
            this.tutoresService.delete(id).subscribe({
                next: () => {
                    this.messageUtil.success('Tutor Removido com sucesso!', 'Sucesso');
                    this.handleGetTutores();
                }
            });
        });
    }

    public handleOpenTutorFotoModal(tutor: Tutores): void {
        this.tutorFotoVisible = true;
        this.tutor = tutor;
    }

    public handleOpenVinculosModal(tutor: Tutores): void {
        this.vinculosVisible = true;
        this.tutor = tutor;
    }
}
