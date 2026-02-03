import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { Tutores } from '@/shared/models/tutores';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CustomDialogModule } from '@/shared/components/custom-dialog/custom-dialog.module';
import { ListboxModule } from 'primeng/listbox';
import { PetsService } from '@/core/pets.service';
import { Pageable } from '@/shared/classes/pageable';
import { Pets } from '@/shared/models/pets';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { FormBuilderModule } from '@/shared/components/form-builder/form-builder.module';
import { ButtonModule } from 'primeng/button';
import { TutoresService } from '@/core/tutores.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';

@Component({
    selector: 'app-tutores-vinculos',
    standalone: true,
    imports: [FormsModule, CustomDialogModule, ListboxModule, FormBuilderModule, ButtonModule],
    template: `
        <scx-custom-dialog [visible]="visible" header="Vinculos de Pet e Tutor"
            width="45rem">
            <div class="bg-neutral-100 dark:bg-neutral-800 rounded p-4">
                <div class="flex gap-2">
                    <p-listbox [options]="page.content" [(ngModel)]="petSelected" optionLabel="nome"
                        [checkmark]="true" [highlightOnSelect]="false" [filter]="true" class="w-full md:w-56"
                        (onChange)="handlePetSelectedChange()" />
                    @if (petSelected) {
                        <div class="flex-1 flex flex-col justify-center items-center">
                            <scx-form [form]="form" [state]="CrudStateEnum.view">
                                <sci-form-item control="nome" type="text" label="Nome" class="col-span-12" />
                                <sci-form-item control="raca" type="text" label="Raça"
                                    class="col-span-12 md:col-span-6" />
                                <sci-form-item control="idade" type="number" label="Idade"
                                    class="col-span-12 md:col-span-6" />
                            </scx-form>
                            <div class="flex-1 flex flex-col justify-center items-center">
                                @if (!hasBond) {
                                    <span class="text-lg font-semibold">Nenhum Vinculo Encontrado</span>
                                    <p-button label="Vincular" icon="pi pi-plus"
                                        (onClick)="handleBondPetTutor()" />
                                } @else {
                                    <span class="text-lg font-semibold">Este pet tem vinculo com o tutor</span>
                                    <p-button label="Desvincular" icon="pi pi-times" severity="danger"
                                        (onClick)="handleUnbondPetTutor()" />
                                }
                            </div>
                        </div>
                    } @else {
                        <div class="flex-1 flex justify-center items-center">
                            <span class="text-lg font-semibold">Nenhum Pet Selecionado</span>
                        </div>
                    }
                </div>
            </div>
            <sci-button position="end" label="Cancelar" severity="danger" (onClick)="onCancel.emit(false)" />
        </scx-custom-dialog>
    `
})
export class TutoresVinculosComponent implements OnInit {
    private readonly petService = inject(PetsService);
    private readonly tutorService = inject(TutoresService);
    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);

    public readonly CrudStateEnum = CrudStateEnum;

    @Input() visible: boolean = false;
    @Input() tutor: Tutores;

    @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onRefresh: EventEmitter<void> = new EventEmitter<void>();

    public page: Pageable<Pets> = new Pageable<Pets>();
    public petSelected!: Pets;
    public form: FormGroup = new FormGroup({
        nome: new FormControl(''),
        raca: new FormControl(''),
        idade: new FormControl('')
    });

    public hasBond: boolean = false;

    ngOnInit(): void {
        this.handleGetPetsList();
    }

    private handleGetPetsList(): void {
        const params = new Map<string, string>();

        this.page.size = 10000;

        this.petService.listPageable(params, this.page).subscribe({
            next: (page) => {
                this.page = page;
            }
        });
    }

    public handlePetSelectedChange(): void {
        this.form.patchValue({
            nome: this.petSelected.nome,
            raca: this.petSelected.raca,
            idade: this.petSelected.idade
        });

        this.petService.findPetById(this.petSelected.id).subscribe({
            next: (res) => {
                const index = res.tutores.findIndex(tutor => tutor.id === this.tutor.id);
                this.hasBond = index !== -1;
            }
        });
    }

    public handleBondPetTutor(): void {
        this.dialogUtil.customConfirmDialog('Deseja realizar o vinculo?', () => {
            this.tutorService.bondTutorPet(this.tutor.id, this.petSelected.id).subscribe({
                next: () => {
                    this.messageUtil.success('Vinculo realizado com sucesso!', 'Sucesso');
                    this.onCancel.emit(false);
                    this.onRefresh.emit();
                }
            });
        });
    }

    public handleUnbondPetTutor(): void {
        this.dialogUtil.customConfirmDialog('Deseja realizar o desvinculo?', () => {
            this.tutorService.unbondTutorPet(this.tutor.id, this.petSelected.id).subscribe({
                next: () => {
                    this.messageUtil.success('Vinculo desfeito com sucesso!', 'Sucesso');
                    this.onCancel.emit(false);
                    this.onRefresh.emit();
                }
            });
        });
    }
}
