import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Perfis } from '@/shared/models/perfis';
import { PerfisService } from '@/core/perfis.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { FormStateType } from '@/shared/models/components/form-state';
import { PerfisComponent } from '../../perfis.component';

// 1. IMPORTAÇÃO DA CONSTANTE DE IMPORTS
import { PERFIS_FORM_IMPORTS } from './perfis-form.imports';

@Component({
    selector: 'app-perfis-form',
    standalone: true,
    // 2. USO DA CONSTANTE NO ARRAY 'imports'
    imports: [PERFIS_FORM_IMPORTS],
    template: `
        <p-dialog [(visible)]="visible" header="Cadastro de Perfis" [modal]="true" [draggable]="false" [closable]="false"
            [style]="{ width: '65rem' }">
            <form [formGroup]="form" class="grid grid-cols-12 gap-6 mt-5">
                <p-floatlabel class="col-span-12">
                    <input type="text" pInputText formControlName="nome" [readOnly]="state === CrudStateEnum.view"
                       fluid />
                    <label for="nome">Nome</label>
                </p-floatlabel>
            </form>
            <p-divider />
            <div class="flex justify-end gap-2">
                @if (state !== CrudStateEnum.view) {
                    <p-button label="Confirmar" severity="secondary" outlined [disabled]="form.invalid" (onClick)="onSaveForm()" />
                }
                <p-button label="Cancelar" severity="danger" (onClick)="onCancelForm.emit({ visible: false, state: CrudStateEnum.none, formData: null })" />
            </div>
        </p-dialog>
    `
})
export class PerfisFormComponent implements OnChanges {
    private readonly perfisService = inject(PerfisService);

    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);
    private readonly perfis = inject(PerfisComponent);

    public readonly CrudStateEnum = CrudStateEnum;

    @Input() visible: boolean;
    @Input() state: CrudStateEnum;
    @Input() formData: Perfis;

    @Output() onCancelForm: EventEmitter<FormStateType<Perfis>> = new EventEmitter<FormStateType<Perfis>>();

    public header!: string;
    public form!: FormGroup;

    ngOnChanges(_changes: SimpleChanges): void {
        this.form = new FormGroup({
            nome: new FormControl(this.formData?.nome ?? '', Validators.required)
        });
    }

    public onSaveForm(): void {
        const { id, ...formData } = this.form.value;

        this.dialogUtil.confirmFormDialog(this.state, () => {
            (this.state === this.CrudStateEnum.add
                ? this.perfisService.insert(formData)
                : this.perfisService.update(this.formData.id, formData)
            ).subscribe({
                next:(res) => {
                    this.messageUtil.success(res.mensagem, 'Sucesso');
                    this.perfis.handleGetRequest();
                    this.onCancelForm.emit({ visible: false, state: this.CrudStateEnum.none, formData: null });
                },
                error: (err) => this.messageUtil.error(err.error.mensagem, 'Erro')
            });
        });
    }
}
