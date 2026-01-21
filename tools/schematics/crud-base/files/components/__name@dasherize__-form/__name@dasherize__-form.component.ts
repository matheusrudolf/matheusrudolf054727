import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { <%= classify(name) %> } from '@/shared/models/<%= dasherize(name) %>';
import { <%= classify(name) %>Service } from '@/core/<%= dasherize(name) %>.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { FormStateType } from '@/shared/models/components/form-state';
import { <%= classify(name) %>Component } from '../../<%= dasherize(name) %>.component';

// 1. IMPORTAÇÃO DA CONSTANTE DE IMPORTS
import { <%= underscore(name).toUpperCase() %>_FORM_IMPORTS } from './<%= dasherize(name) %>-form.imports';

@Component({
    selector: 'app-<%= dasherize(name) %>-form',
    standalone: true,
    // 2. USO DA CONSTANTE NO ARRAY 'imports'
    imports: [<%= underscore(name).toUpperCase() %>_FORM_IMPORTS],
    template: `
        <p-dialog [(visible)]="visible" header="Cadastro de <%= classify(name) %>" [modal]="true" [draggable]="false" [closable]="false"
            [style]="{ width: '65rem' }">
            <form [formGroup]="form" class="grid grid-cols-12 gap-6 mt-5">
                ...Conteudo Form
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
export class <%= classify(name) %>FormComponent implements OnChanges {
    private readonly <%= dasherize(name) %>Service = inject(<%= classify(name) %>Service);

    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);
    private readonly <%= dasherize(name) %> = inject(<%= classify(name) %>Component);

    public readonly CrudStateEnum = CrudStateEnum;

    @Input() visible: boolean;
    @Input() state: CrudStateEnum;
    @Input() formData: <%= classify(name) %>;

    @Output() onCancelForm: EventEmitter<FormStateType<<%= classify(name) %>>> = new EventEmitter<FormStateType<<%= classify(name) %>>>();

    public header!: string;
    public form!: FormGroup;

    ngOnChanges(_changes: SimpleChanges): void {}

    public onSaveForm(): void {
        const { id, ...formData } = this.form.value;

        this.dialogUtil.confirmFormDialog(this.state, () => {
            (this.state === this.CrudStateEnum.add
                ? this.<%= dasherize(name) %>Service.insert(formData)
                : this.<%= dasherize(name) %>Service.update(this.formData.id, formData)
            ).subscribe({
                next:(res) => {
                    this.messageUtil.success(res.mensagem, 'Sucesso');
                    this.<%= dasherize(name) %>.handleGetRequest();
                    this.onCancelForm.emit({ visible: false, state: this.CrudStateEnum.none, formData: null });
                },
                error: (err) => this.messageUtil.error(err.error.mensagem, 'Erro')
            });
        });
    }
}
