import { PetsService } from '@/core/pets.service';
import { Pageable } from '@/shared/classes/pageable';
import { Pets } from '@/shared/models/pets';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Subject, debounceTime, finalize } from 'rxjs';
import { GridTemplateComponent } from './components/grid-template/grid-template.component';
import { ListTemplateComponent } from './components/list-template/list-template.component';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-pets-list',
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    InputTextModule,
    SelectButtonModule,
    ButtonModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    TieredMenuModule,
    ListTemplateComponent,
    GridTemplateComponent,
    RouterLink
],
    template: `
        <p-dataview #dv [value]="page.content" [layout]="layout" [loading]="loading">
            <ng-template #header>
                <div class="flex justify-between gap-2">
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input type="text" pInputText placeholder="Buscar por Nome"
                            [(ngModel)]="search" (ngModelChange)="filterSubject$.next(search)" />
                    </p-iconfield>
                    <div class="hidden md:flex justify-end gap-2">
                        <p-selectbutton [(ngModel)]="layout" [options]="['list', 'grid']"
                            [allowEmpty]="false">
                            <ng-template #item let-item>
                                <i class="pi "
                                [ngClass]="{ 'pi-bars': item === 'list', 'pi-table': item === 'grid' }">
                                </i>
                            </ng-template>
                        </p-selectbutton>
                        <p-button label="Novo" icon="pi pi-plus" routerLink="/add" />
                    </div>
                    <div class="flex md:hidden">
                        <p-button icon="pi pi-ellipsis-v" severity="secondary" text
                            rounded (onClick)="menu.toggle($event)" />
                        <p-tieredmenu #menu [model]="menuItens" [popup]="true" appendTo="body" />
                    </div>
                </div>
            </ng-template>
            <ng-template #list let-items>
                <app-list-template [items]="items" />
            </ng-template>
            <ng-template #grid let-items>
                <app-grid-template [items]="items" />
            </ng-template>
            <ng-template #footer>
                <p-paginator (onPageChange)="handlePageChanges($event)" [rows]="page.size" [totalRecords]="page.total"
                    [rowsPerPageOptions]="[5, 10, 15, 20]" />
            </ng-template>
        </p-dataview>
    `
})
export class PetsListComponent {
    private readonly petsService = inject(PetsService);

    public page: Pageable<Pets> = new Pageable<Pets>();
    public layout: 'list' | 'grid' = 'grid';
    public filterSubject$ = new Subject<any>();
    public search!: string;
    public menuItens: MenuItem[] = [];
    public loading: boolean = false;

    constructor() {
        this.filterSubject$.pipe(debounceTime(500)).subscribe(() => this.handleGetPets());
    }

    ngOnInit(): void {
        this.handleGetPets();
        this.handleBuildTieredMenuItems();
    }

    private handleGetPets(): void {
        const params = new Map<string, string>();

        if (this.search) params.set('nome', this.search);

        this.loading = true;
        this.petsService.listPageable(params, this.page)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (page) => this.page = page
            });
    }

    public handlePageChanges(event: PaginatorState): void {
        this.page.page = event.page;
        this.page.size = event.rows;
        this.handleGetPets();
    }

    private handleBuildTieredMenuItems(): void {
        this.menuItens = [
            {
                label: 'Novo',
                icon: 'pi pi-plus',
                // command: () => this.onOpenForm.emit({ visible: true, state: CrudStateEnum.add, formData: null })
            },
            {
                label: 'Modo de Grade',
                icon: 'pi pi-cogs',
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-bars',
                        command: () => this.layout = 'list'
                    },
                    {
                        label: 'Cards',
                        icon: 'pi pi-table',
                        command: () => this.layout = 'grid'
                    }
                ]
            }
        ];
    }
}
