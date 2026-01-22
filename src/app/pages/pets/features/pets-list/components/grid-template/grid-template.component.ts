import { Pets } from '@/shared/models/pets';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-grid-template',
    standalone: true,
    imports: [ButtonModule, RouterLink],
    template: `
        <div class="grid grid-cols-12 gap-4">
            @for (item of items; track item) {
                <div class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-6 p-2 cursor-pointer"
                    [routerLink]="['/detail', item.id]">
                    <div class="p-6 border border-surface-200 dark:border-surface-700
                        bg-surface-0 dark:bg-surface-900 rounded flex flex-col
                        transition-colors duration-200 hover:bg-surface-100 dark:hover:bg-surface-800">
                        <div class="bg-surface-50 dark:bg-surface-300/30 flex justify-center rounded p-4">
                            <div class="relative mx-auto">
                                @if (item.foto) {
                                    <img class="block xl:block mx-auto rounded w-full"
                                        [src]="item.foto.url" [alt]="item.nome" style="max-width: 300px !important" />
                                } @else {
                                    <div class="flex flex-col justify-center items-center" style="min-height: 150px;">
                                        <span class="pi pi-image text-neutral-400/50" style="font-size: 4rem">
                                        </span>
                                        <p class="font-semibold">Sem Foto</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div class="pt-6">
                            <div class="flex flex-row justify-between products-start gap-2">
                                <div>
                                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                                        {{ item.raca }}
                                    </span>
                                    <div class="text-lg font-medium font-semibold mt-1"> {{ item.nome }} </div>
                                    <div class="text-lg font-medium mt-1"> {{ item.idade }} anos </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-6 mt-6">
                                <div class="flex gap-2">
                                    <button pButton label="Detalhes" class="flex-auto"
                                        [routerLink]="['/detail', item.id]">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    `
})
export class GridTemplateComponent {
    @Input() items!: Pets[];
}
