import { AuthService } from '@/core/auth.service';
import { LayoutService } from '@/layout/service/layout.service';
import { MessageUtil } from '@/shared/utils/message.util';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [InputTextModule, CheckboxModule, ButtonModule, ReactiveFormsModule, MessageModule, PasswordModule, FloatLabelModule],
    template: `
        <div class="h-screen">
            <div class="flex justify-center items-center h-full">
                <div class="absolute top-0 right-0 mt-4 mr-6">
                    <button pButton type="button" severity="secondary" [icon]="layoutService.isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'"
                        rounded text (click)="toggleDarkMode()">
                    </button>
                </div>
                <div class="flex flex-col rounded-[2vw] bg-linear-to-b from-emerald-500 to-transparent dark:from-emerald-800 to-transparent p-1">
                    <div class="content-center bg-white dark:bg-stone-950 rounded-[2vw] p-8 md:p-15 shadow-lg shadow-emerald-300/40 dark:shadow-emerald-500/40">
                        <p class="text-2xl text-center font-bold md:text-3xl" style="margin-bottom: 0;">Seja bem vindo ao Gerenciador de Pets</p>
                        <p class="text-lg font-semibold text-center md:text-xl" style="margin: 0;">Gestão de Pets Web</p>
                        <p class="text-center text-slate-400 dark:text-white" style="margin-top: 3rem;">Faça login para continuar</p>
                        <div class="flex justify-center">
                            <form [formGroup]="loginForm" class="flex flex-col gap-6 mt-4 w-full"
                                (ngSubmit)="onSubmit()">
                                <div class="flex flex-col gap-2">
                                    <p-floatlabel>
                                        <input pInputText type="text" formControlName="username" fluid>
                                        <label for="username" class="font-semibold">Usuário</label>
                                    </p-floatlabel>
                                    @if (loginForm.get('username').invalid && (loginForm.get('username').touched || formSubmitted)) {
                                        <p-message severity="error" size="small" variant="simple">Usuário é obrigatório</p-message>
                                    }
                                </div>
                                <div class="flex flex-col gap-2">
                                    <p-floatlabel>
                                        <p-password formControlName="password" [feedback]="false" toggleMask fluid />
                                        <label for="password" class="font-semibold">Senha</label>
                                    </p-floatlabel>
                                    @if (loginForm.get('password').invalid && (loginForm.get('password').touched || formSubmitted)) {
                                        <p-message severity="error" size="small" variant="simple">Senha é obrigatório</p-message>
                                    }
                                </div>
                                @if (errorMessage) {
                                    <p-message severity="error"> {{ errorMessage }} </p-message>
                                }
                                <button pButton type="submit" label="Entrar" [loading]="loading" [disabled]="loginForm.invalid || loading"></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class LoginComponent {
    public readonly layoutService = inject(LayoutService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute)
    private readonly fb = inject(FormBuilder);
    private readonly messageService = inject(MessageUtil);

    public loginForm: FormGroup;
    public loading: boolean = false;
    public errorMessage: string = '';
    public returnUrl: string = '';
    public formSubmitted: boolean = false;

    constructor() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [false]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pets';
    }

    public toggleDarkMode(): void {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    public onSubmit(): void {
        this.formSubmitted = true;

        if (this.loginForm.invalid) {
            this.formSubmitted = false;
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        const { username, password } = this.loginForm.value;

        this.authService.login(username, password).subscribe({
            next: (_res) => {
                this.formSubmitted = false;
                this.messageService.success('Login realizado com sucesso!', 'Sucesso');
                this.router.navigate([this.returnUrl]);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Usuário ou senha inválidos';
                console.error('Erro no login: ', err);
            }
        });
    }
}
