import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule],
    template: `
        <h2>Gerenciamento de Pets Web</h2>
        <router-outlet />
    `
})
export class PetsComponent { }
