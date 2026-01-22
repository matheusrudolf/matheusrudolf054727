import { Component } from '@angular/core';
import { AppMenu } from './app.menu';
import { LucideAngularModule, PawPrint } from 'lucide-angular';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, LucideAngularModule],
    template: `
        <div class="layout-sidebar shadow-xl">
            <div class="h-full flex flex-col pt-4 gap-4">
                <div class="flex flex-col items-center gap-4">
                    <lucide-icon [img]="icons.PawPrint" size="50"></lucide-icon>
                    <!-- <img src="assets/imgs/solution_softworks_logo.png" width="80" alt="Solution Softworks"> -->
                    <span class="text-xl">Gerenciador de Pets</span>
                    <small class="text-gray-400/50 dark:text-gray-200/50">Versão 1.0</small>
                </div>
                <div class="flex-1 overflow-y-auto">
                    <app-menu></app-menu>
                </div>
            </div>
        </div>
    `
})
export class AppSidebar {
    public readonly icons = { PawPrint };
}
