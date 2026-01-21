export interface DatagridToolbarType {
    name?: 'add' | 'delete' | 'export' | 'columnChooser';
    icon?: string;
    location: 'before' | 'center' | 'after';
    locateInMenu?: 'auto' | 'always' | 'never';
    text?: string;
    widget?: 'button' | 'inputText' | 'multiselect' | 'select';
    severity?: string;
    disabled?: boolean;
    placeholder?: string;
    action?: () => void;
}
