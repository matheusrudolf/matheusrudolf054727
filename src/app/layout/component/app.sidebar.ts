import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: `
        <div class="layout-sidebar shadow-xl">
            <div class="h-full flex flex-col pt-4 gap-4">
                <div class="flex flex-col items-center gap-4">
                    <img src="assets/imgs/solution_softworks_logo.png" width="80" alt="Solution Softworks">
                    <span class="text-xl">Solution Softworks</span>
                    <small class="text-gray-400/50 dark:text-gray-200/50">Versão 0.1.2</small>
                </div>
                <div class="flex-1 overflow-y-auto">
                    <app-menu></app-menu>
                </div>
                <div class="flex justify-center pb-4">
                    <img src="assets/imgs/solution_softworks_brand_transparent.png" width="125" alt="Solution Softworks">
                </div>
            </div>
        </div>
    `
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
