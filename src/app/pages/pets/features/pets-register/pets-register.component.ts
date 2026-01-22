import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-pets-register',
    standalone: true,
    imports: [ButtonModule, RouterLink],
    template: `
         <div class="flex justify-between mb-4">
            <p-button label="Voltar" icon="pi pi-arrow-left" severity="danger"
                routerLink="/list" />
            <!-- <p-button label="Editar" icon="pi pi-pencil" severity="secondary" /> -->
        </div>
    `
})
export class PetsRegisterComponent {
    private readonly route = inject(ActivatedRoute);

    private state!: CrudStateEnum;

    constructor() {
        this.route.paramMap.subscribe({
            next: (res) => {
                this.state = res['params'].id ? CrudStateEnum.edit : CrudStateEnum.add;
            }
        });
    }
}
