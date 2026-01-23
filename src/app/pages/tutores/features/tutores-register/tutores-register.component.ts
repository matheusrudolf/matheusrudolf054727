import { TutoresService } from '@/core/tutores.service';
import { FormBuilderModule } from '@/shared/components/form-builder/form-builder.module';
import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
    selector: 'app-tutores-register',
    standalone: true,
    imports: [ButtonModule, RouterLink, FormBuilderModule, DividerModule, FieldsetModule],
    template: `
        <p-fieldset [legend]="state === CrudStateEnum.add ? 'Cadastrar' : 'Alterar'">
            <scx-form [form]="form">
                <sci-form-item control="nome" type="text" label="Nome" class="col-span-12 md:col-span-4" />
                <sci-form-item control="email" type="text" label="E-mail" class="col-span-12 md:col-span-4" />
                <sci-form-item control="telefone" type="inputmask" label="Telefone" mask="(99) 9 9999-9999"
                    class="col-span-12 md:col-span-4" />
                <sci-form-item control="endereco" type="text" label="Endereço" class="col-span-12 md:col-span-4" />
                <sci-form-item control="cpf" type="inputmask" label="CPF" mask="999.999.999-99"
                    class="col-span-12 md:col-span-4" />
            </scx-form>
        </p-fieldset>
        <p-divider />
        <div class="flex justify-end gap-2">
            <p-button label="Cancelar" severity="danger" [routerLink]="['/tutores', 'list']" />
            <p-button label="Salvar" icon="pi pi-save" (onClick)="handleSaveData()" />
        </div>
    `
})
export class TutoresRegisterComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly tutoresService = inject(TutoresService);

    public readonly CrudStateEnum = CrudStateEnum;
    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);

    public state!: CrudStateEnum;
    public tutorId!: number;
    public form: FormGroup = new FormGroup({
        nome: new FormControl(''),
        email: new FormControl(''),
        telefone: new FormControl(''),
        endereco: new FormControl(''),
        cpf: new FormControl('')
    });

    ngOnInit(): void {
        this.handleGetPetIdParam();
    }

    private handleGetPetIdParam(): void {
        this.route.paramMap.subscribe({
            next: (res) => {
                this.tutorId = res['params'].id;

                if (this.tutorId) {
                    this.state = CrudStateEnum.edit;
                    this.tutoresService.findTutorById(this.tutorId).subscribe({
                        next: (res) => {
                            this.form.patchValue({
                                nome: res.nome,
                                email: res.email,
                                telefone: res.telefone,
                                endereco: res.endereco,
                                cpf: res.cpf
                            })
                        }
                    })
                } else {
                    this.state = CrudStateEnum.add
                }
            }
        });
    }

    public handleSaveData(): void {
        const formData = this.form.value;

        const req = this.state === CrudStateEnum.add
            ? this.tutoresService.insert(formData)
            : this.tutoresService.update(this.tutorId, formData);

        this.dialogUtil.confirmFormDialog(this.state, () => {
            req.subscribe({
                next: () => {
                    const typeMsg = this.state === CrudStateEnum.add ? 'cadastrado' : 'alterado';
                    this.messageUtil.success(`Tutor ${typeMsg} com sucesso!`, 'Sucesso');
                    this.router.navigateByUrl('tutores/list');
                }
            });
        });
    }
}
