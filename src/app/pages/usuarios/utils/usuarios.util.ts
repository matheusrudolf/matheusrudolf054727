import { DatagridColumnType } from "@/shared/models/components/datagrid-column";

export class UsuariosUtil {

    public columnBuildFactory(): DatagridColumnType[] {
        return [
            { field: 'id', header: 'ID', visible: false },
            { field: 'nome', header: 'Nome', visible: true },
            { field: 'email', header: 'E-mail', visible: true },
            { field: 'senha', header: 'Senha', visible: false }
        ];
    }

}
