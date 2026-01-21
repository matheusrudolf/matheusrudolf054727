import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuarios } from '@/shared/models/usuarios';
import { UsuariosService } from '@/core/usuarios.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { FormStateType } from '@/shared/models/components/form-state';
import { UsuariosComponent } from '../../usuarios.component';
import { PerfisService } from '@/core/perfis.service';
import { Perfis } from '@/shared/models/perfis';

// 1. IMPORTAÇÃO DA CONSTANTE DE IMPORTS
import { USUARIOS_FORM_IMPORTS } from './usuarios-form.imports';

@Component({
    selector: 'app-usuarios-form',
    standalone: true,
    // 2. USO DA CONSTANTE NO ARRAY 'imports'
    imports: [USUARIOS_FORM_IMPORTS],
    template: `
        <p-dialog [(visible)]="visible" header="Cadastro de Usuarios" [modal]="true" [draggable]="false" [closable]="false"
            [style]="{ width: '65rem' }">
            <form [formGroup]="form" class="grid grid-cols-12 gap-6 mt-5">
                <p-floatlabel class="col-span-4">
                    <input type="text" pInputText formControlName="nome" [readonly]="state === CrudStateEnum.view"
                        fluid>
                    <label for="nome">Nome</label>
                </p-floatlabel>
                <p-floatlabel class="col-span-4">
                    <input type="text" pInputText formControlName="email" [readonly]="state === CrudStateEnum.view"
                        fluid>
                    <label for="email">E-mail</label>
                </p-floatlabel>
                <p-floatlabel class="col-span-4">
                    <p-password formControlName="senha" toggleMask [feedback]="false" fluid />
                    <label for="senha">Senha</label>
                </p-floatlabel>
                <div class="col-span-12">
                    <app-datagrid-edit [datasource]="perfisDatasource" [injection]="perfilsService" [fields]="['id', 'nome']"
                        [readOnly]="state === CrudStateEnum.view" (onSavingData)="handlePatchPerfisData($event)"
                        (onRemovingData)="handlePatchPerfisData($event)" />
                </div>
            </form>
            <p-divider />
            <div class="flex justify-end gap-2">
                @if (state !== CrudStateEnum.view) {
                    <p-button label="Confirmar" severity="secondary" outlined (onClick)="onSaveForm()" />
                }
                <p-button label="Cancelar" severity="danger" (onClick)="onCancelForm.emit({ visible: false, state: CrudStateEnum.none, formData: null })" />
            </div>
        </p-dialog>
    `
})
export class UsuariosFormComponent implements OnChanges {
    private readonly usuariosService = inject(UsuariosService);
    public readonly perfilsService = inject(PerfisService);

    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);
    private readonly usuarios = inject(UsuariosComponent);

    public readonly CrudStateEnum = CrudStateEnum;

    @Input() visible: boolean;
    @Input() state: CrudStateEnum;
    @Input() formData: Usuarios;

    @Output() onCancelForm: EventEmitter<FormStateType<Usuarios>> = new EventEmitter<FormStateType<Usuarios>>();

    public header!: string;
    public form!: FormGroup;
    public perfisDatasource: any[] = [];

    ngOnChanges(_changes: SimpleChanges): void {
        this.form = new FormGroup({
            nome: new FormControl(this.formData?.nome ?? '', Validators.required),
            email: new FormControl(this.formData?.email ?? '', Validators.required),
            senha: new FormControl({ value: this.formData?.senha ?? '', disabled: this.state === this.CrudStateEnum.view }, Validators.required),
            perfils_vinculados_ids: new FormControl(this.formData?.perfils_vinculados_ids ?? []),
            perfils_vinculados_nomes: new FormControl(this.formData?.perfils_vinculados_nomes ?? []),
        });

        this.perfisDatasource = this.formData?.perfils_vinculados_ids.map((id, i) => ({
            id, nome: this.formData.perfils_vinculados_nomes[i]
        })) ?? [];
    }

    public handlePatchPerfisData(event: Perfis[]): void {
        const ids = event.map(r => r.id);
        const nomes = event.map(r => r.nome);

        this.form.patchValue({ perfils_vinculados_ids: ids, perfils_vinculados_nomes: nomes });
    }

    public onSaveForm(): void {
        const { id, ...formData } = this.form.value;

        this.dialogUtil.confirmFormDialog(this.state, () => {
            (this.state === this.CrudStateEnum.add
                ? this.usuariosService.insert(formData)
                : this.usuariosService.update(this.formData.id, formData)
            ).subscribe({
                next: (res) => {
                    this.messageUtil.success(res.mensagem, 'Sucesso');
                    this.usuarios.handleGetRequest();
                    this.onCancelForm.emit({ visible: false, state: this.CrudStateEnum.none, formData: null });
                },
                error: (err) => this.messageUtil.error(err.error.mensagem, 'Erro')
            });
        });
    }
}
