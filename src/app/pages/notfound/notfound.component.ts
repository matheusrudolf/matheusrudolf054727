import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [ButtonModule, DividerModule, RouterModule],
    template: `
        <div class="h-screen">
            <div class="flex justify-center items-center bg-linear-to-br from-cyan-800 to-emerald-400 dark:from-cyan-950 to-emerald-700 h-full">
                <div class="flex justify-center items-center bg-linear-to-b from-emerald-500 to-transparent dark:from-emerald-800 to-transparent rounded-[2vw] h-153 w-112 p-1">
                    <div class="bg-white dark:bg-stone-800 rounded-[2vw] h-150 w-110 p-8 shadow-xl shadow-cyan-500/80 dark:shadow-cyan-300/80">
                        <div class="flex flex-col">
                            <div class="flex justify-center mb-4">
                                <img src="assets/imgs/solution_softworks_logo.png" alt="solution_softworks" width="65">
                            </div>
                            <h2 class="text-center" style="margin: 0;">404</h2>
                            <h1 class="text-center" style="font-weight: 900;">Not Found</h1>
                            <p class="text-center text-slate-400 dark:text-white">Ops! Página não encontrada.</p>
                        </div>
                        <div class="content-end h-60">
                            <div class="flex justify-center">
                                <div class="pi pi-exclamation-triangle text-emerald-400" style="font-size: 10rem;"></div>
                            </div>
                            <p-divider />
                            <div class="flex justify-center">
                                <button pButton label="Voltar ao Dashboard" size="large" [routerLink]="['/']"
                                    style="padding: 1.2rem;">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class NotfoundComponent { }
