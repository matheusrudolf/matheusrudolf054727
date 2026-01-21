import { AuthService } from '@/core/auth.service';
import { LayoutService } from '@/layout/service/layout.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NewPassword } from '@/shared/models/auth/reset-password';
import { MessageUtil } from '@/shared/utils/message.util';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-forgetpassword',
    standalone: true,
    imports: [FloatLabelModule, InputTextModule, CheckboxModule, ButtonModule, ReactiveFormsModule, MessageModule, PasswordModule, RouterLink, InputOtpModule, DividerModule],
    template: `
        <div class="h-screen">
            <div class="flex justify-center items-center h-full">
                <div class="absolute top-0 right-0 mt-4 mr-6">
                    <button pButton type="button" severity="secondary" [icon]="layoutService.isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'"
                        rounded text (click)="toggleDarkMode()">
                    </button>
                </div>
                <div class="flex flex-col rounded-[2vw] bg-linear-to-b from-emerald-500 to-transparent dark:from-emerald-800 to-transparent p-1">
                    <div class="content-center bg-white dark:bg-stone-950 rounded-[2vw] shadow-lg shadow-emerald-300/40 dark:shadow-emerald-500/40">
                        <div class="mt-4 ml-4">
                            <p-button label="Voltar" icon="pi pi-angle-left" text routerLink="/auth/login" />
                        </div>
                        <div class="content-center bg-white rounded-[2vw] dark:bg-stone-950 p-8 md:p-12">
                            <p class="text-xl font-bold md:text-3xl" style="margin: 0;"> {{ title }} </p>
                            <div class="w-sm md:w-md text-wrap">
                                <p class="text-slate-400 dark:text-white" style="margin-top: 1rem; margin-bottom: 0"> {{ subtitle }} </p>
                            </div>
                            <div class="flex justify-center mt-2">
                                <form [formGroup]="recoveryForm" class="flex flex-col gap-6 mt-4 w-full" (ngSubmit)="onSubmit()">
                                    @if (passwordSteps === 'confirmation') {
                                        <p-floatlabel>
                                            <input pInputText type="text" formControlName="email" fluid>
                                            <label for="email" class="font-semibold">E-mail</label>
                                        </p-floatlabel>
                                        @if (recoveryForm.get('email').invalid && (recoveryForm.get('email').touched || formSubmitted)) {
                                            <p-message severity="error" size="small" variant="simple">E-mail é obrigatório</p-message>
                                        }
                                    } @else if (passwordSteps === 'validation') {
                                        <div class="flex justify-center p-2">
                                            <p-inputotp formControlName="code" size="large" />
                                        </div>
                                        @if (recoveryForm.get('code').invalid && (recoveryForm.get('code').touched || formSubmitted)) {
                                            <p-message severity="error" size="small" variant="simple">Códido de confirmação é obrigatório.</p-message>
                                        }
                                        <small>O código expirou? Solicite novamente
                                            <a class="no-underline cursor-pointer text-primary"
                                            (click)="handleRequestPasswordRequest();messageUtil.info('Nova solicitação enviada', 'Informação')">aqui</a>
                                        </small>
                                    } @else if (passwordSteps === 'setPassword') {
                                        <div class="flex flex-col gap-2">
                                            <p-floatlabel>
                                                <p-password formControlName="newPassword" [min]="8" toggleMask weakLabel="Fraco"
                                                    mediumLabel="Médio" strongLabel="Forte" fluid>
                                                    <ng-template #header>
                                                        <div class="font-semibold text-xm mb-4">Redefinir Senha</div>
                                                    </ng-template>
                                                    <ng-template #footer>
                                                        <p-divider />
                                                        <ul class="pl-2 my-0 leading-normal">
                                                            <li>Pelo menos um minusculo</li>
                                                            <li>Pelo menos um maiusculo</li>
                                                            <li>Pelo menos um número</li>
                                                            <li>Mínimo 8 caractéres</li>
                                                        </ul>
                                                    </ng-template>
                                                </p-password>
                                                <label for="newPassword" class="font-semibold">Nova Senha</label>
                                            </p-floatlabel>
                                            @if (recoveryForm.get('newPassword').invalid && (recoveryForm.get('newPassword').touched || formSubmitted)) {
                                                <p-message severity="error" size="small" variant="simple">Nova senha é obrigatório</p-message>
                                            }
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <p-floatlabel>
                                                <p-password formControlName="confirmPassword" [feedback]="false" [min]="8" toggleMask fluid />
                                                <label for="confirmPassword" class="font-semibold">Confirmar Senha</label>
                                            </p-floatlabel>
                                            @if (recoveryForm.get('confirmPassword').invalid && (recoveryForm.get('confirmPassword').touched || formSubmitted)) {
                                                <p-message severity="error" size="small" variant="simple">Confirmar senha é obrigatório</p-message>
                                            }
                                        </div>
                                    }
                                    @if (errorMessage) {
                                        <p-message severity="error"> {{ errorMessage }} </p-message>
                                    }
                                    <button pButton type="submit" label="Continuar" [loading]="loading" [disabled]="recoveryForm.invalid || loading"></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ForgetpasswordComponent {
    public readonly layoutService = inject(LayoutService);
    private readonly authService = inject(AuthService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    public readonly messageUtil = inject(MessageUtil);

    public recoveryForm: FormGroup;
    public formSubmitted: boolean = false;
    public errorMessage: string = '';
    public loading: boolean = false;

    public passwordSteps: 'confirmation' | 'validation' | 'setPassword' = 'confirmation';

    public title: string = 'Recuperar Senha';
    public subtitle: string = `Insira o e-mail e enviaremos um código de verificação
        para redefinir a sua senha em seu e-mail.`;

    constructor() {
        this.recoveryForm = this.fb.group({
            email: ['', Validators.required],
            code: [''],
            newPassword: [''],
            confirmPassword: ['']
        });
    }

    public toggleDarkMode(): void {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    public onSubmit(): void {
        this.formSubmitted = true;

        if (this.recoveryForm.invalid) {
            this.formSubmitted = false;
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        if (this.passwordSteps === 'confirmation') {
            this.handleRequestPasswordRequest();
        } else if (this.passwordSteps === 'validation') {
            this.handleRequestValidationCodeConfirmation();
        } else {
            this.handleResetPassword();
        }
    }

    public handleRequestPasswordRequest(): void {
        this.authService.resetPasswordRequest(this.recoveryForm.get('email').value)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (_res) => {
                    this.passwordSteps = 'validation';
                    this.title = 'Insira o código de verificação';
                    this.subtitle = `O código de verificação foi enviado para o seu e-mail ${this.recoveryForm.get('email').value}. O código é válido por 15 minutos.`;
                    this.addValidation('code');
                },
                error: (err) => {
                    this.passwordSteps = 'validation';
                    this.errorMessage = err.error?.message || 'E-mail inválido';
                    console.error('Erro no reset password: ', err);
                }
            });
    }

    private handleRequestValidationCodeConfirmation(): void {
        const email = this.recoveryForm.get('email').value;
        const code = this.recoveryForm.get('code').value;

        this.authService.validateEmailCodeVerification(email, code)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (_res) => {
                    this.passwordSteps = 'setPassword';
                    this.title = 'Insira a nova Senha';
                    this.subtitle = 'A senha requer o mínimo de 8 caracteres contendo letras, números e simbolos';
                    this.addValidation('newPassword', 8);
                    this.addValidation('confirmPassword');
                },
                error: (err) => {
                    this.passwordSteps = 'setPassword';
                    this.errorMessage = err.error?.message || 'Código de verificação expirou';
                    console.error('Erro no reset password: ', err);
                }
            });
    }

    private handleResetPassword(): void {
        const form = this.recoveryForm.value;
        const nesPassword: NewPassword = {
            email: form.email,
            codigo: form.code,
            novaSenha: form.newPassword,
            confirmarSenha: form.confirmPassword
        };

        this.authService.resetPassword(nesPassword)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (res) => {
                    this.router.navigateByUrl('/auth/login');
                    this.messageUtil.success(res.mensagem, 'Sucesso');
                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Nova senha e Confirma senha não conferem';
                    console.error('Erro no reset password: ', err);
                }
            });
    }

    private addValidation(field: string, minLength?: number): void {
        this.recoveryForm.get(field).reset();
        if (minLength) {
            this.recoveryForm.get(field).setValidators([Validators.required, Validators.minLength(minLength)]);
        } else {
            this.recoveryForm.get(field).setValidators([Validators.required]);
        }
        this.recoveryForm.get(field).updateValueAndValidity();

        this.recoveryForm.markAsUntouched();
        this.recoveryForm.markAsPristine();
        this.formSubmitted = false;
    }
}
