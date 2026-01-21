import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, ConfirmDialogModule, ButtonModule, NgClass],
    template: `
        <router-outlet></router-outlet>

        <p-confirmdialog #confirm>
            <ng-template #footer let-footer>
                <p-button label="Confirmar" severity="secondary" outlined (onClick)="confirm.onAccept()" />
                <p-button label="Cancelar" severity="danger" (onClick)="confirm.onReject()" />
            </ng-template>
        </p-confirmdialog>

        <p-confirmdialog key="logout" #confirmLogout>
            <ng-template #message let-message>
                <div class="flex flex-col items-center w-full gap-4 border-b border-surface-200 dark:border-surface-700">
                    <i [ngClass]="message.icon" class="!text-5xl"></i>
                    <p style="margin-bottom: 1rem;">{{ message.message }}</p>
                </div>
            </ng-template>
            <ng-template #footer let-footer>
                <p-button label="Confirmar" severity="secondary" outlined (onClick)="confirmLogout.onAccept()" />
                <p-button label="Cancelar" severity="danger" (onClick)="confirmLogout.onReject()" />
            </ng-template>
        </p-confirmdialog>

        <p-toast position="bottom-center" />
    `
})
export class AppComponent { }
