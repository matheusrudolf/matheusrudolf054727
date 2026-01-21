export class Pageable<T> {
    public dados: T[] = [];
    public size: number = 10;
    public page!: number;
    public total!: number;
    public sucesso: boolean;
    public mensagem: string;
}
