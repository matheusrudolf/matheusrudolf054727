export interface DatagridColumnType {
    field: string;
    header: string;
    width?: string;
    type?: 'data' | 'action';
    visible?: boolean;
    sortable?: boolean;
    alignment?: 'left' | 'center' | 'right';
    dataType?: 'string' | 'number' | 'date' | 'boolean';
}
