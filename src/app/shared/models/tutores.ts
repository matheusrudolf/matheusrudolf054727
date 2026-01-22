import { Foto } from "./foto";

export interface Tutores {
    id?: number;
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    cpf?: number;
    foto?: Foto;
}
