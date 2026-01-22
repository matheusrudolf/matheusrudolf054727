import { Pets } from '@/shared/models/pets';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-list-template',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterLink],
    template: `
        @for (item of items; track item) {
            <div>
                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4 transition-colors duration-200
                    hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer"
                    [ngClass]="{ 'border-t border-surface-200 dark:border-surface-700': !$first }"
                    [routerLink]="['/detail', item.id]">
                    <div class="md:w-40 relative">
                        @if (item.foto) {
                            <img class="block xl:block mx-auto rounded w-full"
                                [src]="item.foto.url" [alt]="item.nome"/>
                        } @else {
                            <div class="flex flex-col items-center">
                                <span class="pi pi-image text-neutral-400/50" style="font-size: 4rem;"></span>
                                <p class="font-semibold">Sem Foto</p>
                            </div>
                        }
                    </div>
                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                        <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                            <div>
                                <span class="font-medium text-surface-500 dark text-surface-400 text-sm">
                                    {{ item.raca }}
                                </span>
                                <div class="text-lg font-medium font-semibold mt-2"> {{ item.nome }} </div>
                                <div class="text-lg font-medium mt-2"> {{ item.idade }} anos </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col md:items-end gap-8">
                        <div class="flex flex-row-reverse md:flex-row gap-2">
                            <p-button label="Detalhes" [routerLink]="['/detail', item.id]" />
                        </div>
                    </div>
                </div>
            </div>
        }
    `
})
export class ListTemplateComponent {
    @Input() items!: Pets[];
}
