import { Foto } from "./foto";
import { Tutores } from "./tutores";

export interface Pets {
    id?: number;
    nome?: string;
    raca?: string;
    idade?: number;
    foto?: Foto;
    tutores?: Tutores[];
}
