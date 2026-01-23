import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-tutores',
    standalone: true,
    imports: [RouterModule],
    template: `
        <h2>Gerenciamento de Tutores</h2>
        <router-outlet />
    `
})
export class TutoresComponent { }
