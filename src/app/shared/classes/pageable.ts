export class Pageable<T> {
    public content: T[] = [];
    public page: number = 0;
    public size: number = 5;
    public total!: number;
    public pageCount!: number;
}
