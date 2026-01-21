import { Usuarios } from '@/shared/models/usuarios';
import { ListAll } from '@/shared/classes/listall';
import { AuthService } from '@/core/auth.service';
import { UsuariosService } from '@/core/usuarios.service';
import { DatagridModule } from '@/shared/components/datagrid/datagrid.module';
import { Component, inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [DatagridModule],
    template: `
        <p>Seja bem vindo {{ username }} </p>

        <scx-datagrid [datasource]="usuarioService" [stripedRows]="true"
            [showGridlines]="false" [allowEdit]="true" [allowSelection]="true"
            [resizableColumns]="false">
            <sco-datagrid-toolbar [enabled]="true">
                <!-- <sci-datagrid-toolbar-item location="before" widget="inputtext" label="Código" [locateInMenu]="false" />
                <sci-datagrid-toolbar-item location="after" widget="button" icon="plus" severity="secondary"
                    menuLabel="Adicionar registro" tooltip="Adicionar registro" [locateInMenu]="true" />
                <sci-datagrid-toolbar-item location="after" widget="button" icon="trash" severity="danger"
                    menuLabel="Remover registros selecionados" [disabled]="selected.length === 0"
                    tooltip="Remover registros selecionados" [locateInMenu]="true" /> -->
            </sco-datagrid-toolbar>

            <sci-datagrid-column field="id" header="ID" />
            <sci-datagrid-column field="nome" header="Nome" />
            <sci-datagrid-column field="email" header="E-mail" />
            <!-- <sci-datagrid-column type="action">
                <sci-action icon="pencil" severity="secondary" tooltip="Editar" />
                <sci-action icon="trash" severity="danger" tooltip="Remover" />
            </sci-datagrid-column> -->
        </scx-datagrid>
    `
})
export class HomeComponent implements OnInit {
    public readonly usuarioService = inject(UsuariosService);
    private readonly authService = inject(AuthService);

    public selected: Usuarios[] = [];

    public username!: string;

    ngOnInit(): void {
        this.authService.currentUser$.subscribe({
            next: (res) => this.username = res.username
        });
    }
}
