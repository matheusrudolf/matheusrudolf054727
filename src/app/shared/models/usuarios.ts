export interface Usuarios {
    id?: number;
    nome?: string;
    email?: string;
    senha?: string;
    perfils_vinculados_ids?: number[];
    perfils_vinculados_nomes?: string[];
}
