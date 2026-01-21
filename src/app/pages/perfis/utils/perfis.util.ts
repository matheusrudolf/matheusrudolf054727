import { DatagridColumnType } from "@/shared/models/components/datagrid-column";

export class PerfisUtil {

    public columnBuildFactory(): DatagridColumnType[] {
        return [
            { field: 'id', header: 'ID', visible: false },
            { field: 'nome', header: 'Nome', visible: true }
        ];
    }

}
