import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { PetsService } from '@/core/pets.service';
import { FormBuilderModule } from '@/shared/components/form-builder/form-builder.module';
import { Pets } from '@/shared/models/pets';
import { Tutores } from '@/shared/models/tutores';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ListboxModule } from 'primeng/listbox';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-pets-details',
    standalone: true,
    imports: [FormsModule, RouterLink, CardModule, ButtonModule, ListboxModule, DividerModule, FormBuilderModule],
    template: `
        <div class="flex justify-between mb-4">
            <p-button label="Voltar" icon="pi pi-arrow-left" severity="danger"
                routerLink="/list" />
            <p-button label="Editar" icon="pi pi-pencil" severity="secondary"
                [routerLink]="['/edit', petData?.id]" />
        </div>
        @if (petData) {
            <div class="flex flex-col md:flex-row gap-4">
                <p-card class="w-auto md:w-[25rem]" [style]="{ overflow: 'hidden' }">
                    <ng-template #header>
                        @if (petData.foto) {
                            <img class="w-full" [src]="petData.foto.url" [alt]="petData.nome" />
                        } @else {
                            <div class="flex flex-col bg-surface-50 dark:bg-surface-300/30 justify-center items-center w-full">
                                <span class="pi pi-image text-neutral-400/50" style="font-size: 4rem">
                                </span>
                                <p class="font-semibold">Sem Foto</p>
                            </div>
                        }
                    </ng-template>
                    <ng-template #title>
                        <div class="flex justify-between">
                            <span class="text-2xl font-bold">
                                {{ petData.nome }}
                            </span>
                            <span class="text-2xl font-bold">
                                Idade: {{ petData.idade }}
                            </span>
                        </div>
                    </ng-template>
                    <ng-template #subtitle>
                        <span class="text-lg font-semibold text-surface-500 dark:text-surface-400">
                            Raça: {{ petData.raca }}
                        </span>
                    </ng-template>
                </p-card>
                <div class="flex flex-col md:flex-row gap-4 flex-1 min-w-0">
                    <div class="flex flex-col gap-2">
                        <span class="text-lg font-bold">Lista de Tutores</span>
                        <p-listbox [options]="petData.tutores" [(ngModel)]="selectedTutor" optionLabel="nome"
                            striped class="w-full md:w-80 h-full" emptyMessage="Nenhum Tutor Encontrado"
                            (onChange)="handleChangesFormTutor()" />
                    </div>
                    <div class="bg-surface-50 dark:bg-surface-300/30 rounded flex-1 min-w-0">
                        @if (selectedTutor) {
                            <scx-form [form]="form" [state]="CrudStateEnum.view">
                                <sci-form-item control="nome" type="text" label="Nome" class="col-span-12" />
                                <sci-form-item control="email" type="text" label="E-mail" class="col-span-12 md:col-span-6" />
                                <sci-form-item control="endereco" type="text" label="Endereço" class="col-span-12 md:col-span-6" />
                                <sci-form-item control="telefone" type="inputmask" label="Telefone" mask="(99) 9 9999-9999"
                                    class="col-span-12 md:col-span-6" />
                                <sci-form-item control="cpf" type="inputmask"type="inputmask" label="CPF" mask="999.999.999-99"
                                    class="col-span-12 md:col-span-6" />
                            </scx-form>
                        } @else {
                            <div class="flex justify-center items-center h-full">
                                <span class="font-semibold">Nenhum Tutor Selecionado</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        }
    `
})
export class PetsDetailsComponents implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly petService = inject(PetsService);

    public readonly CrudStateEnum = CrudStateEnum;

    public petData: Pets;
    public selectedTutor: Tutores;
    public form: FormGroup = new FormGroup({
        nome: new FormControl(''),
        email: new FormControl(''),
        telefone: new FormControl(''),
        endereco: new FormControl(''),
        cpf: new FormControl('')
    });;

    ngOnInit(): void {
        this.handleGetParamIdDetail();
    }

    private handleGetParamIdDetail(): void {
        this.route.paramMap.subscribe({
            next: (res) => this.handleGetPetById(res['params'].id)
        });
    }

    private handleGetPetById(id: number): void {
        this.petService.findPetById(id).subscribe({
            next: (res) => {
                this.petData = res
            }
        });
    }

    public handleChangesFormTutor(): void {
        if (!this.selectedTutor) return;

        this.form.patchValue({
            nome: this.selectedTutor.nome,
            email: this.selectedTutor.email,
            telefone: this.selectedTutor.telefone,
            endereco: this.selectedTutor.endereco,
            cpf: this.selectedTutor.cpf
        });
    }
}
