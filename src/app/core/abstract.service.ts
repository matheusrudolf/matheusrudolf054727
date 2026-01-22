import { ListAll } from '@/shared/classes/listall';
import { Pageable } from '@/shared/classes/pageable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractService<RESPONSE, RESUME> {
    protected readonly http = inject(HttpClient);

    protected abstract get resource(): string;

    protected get endpoint(): string {
        return `${environment.apiUrl}/v1/${this.resource}`;
    }

    public listPageable(params: Map<string, any>, page: Pageable<any>): Observable<Pageable<RESUME>> {
        let httpParams = new HttpParams().set('page', '');

        if (params) params.forEach((value, key) => httpParams = httpParams.set(key, value));

        if (page.size) httpParams = httpParams.set('size', String(page.size));

        httpParams = httpParams.set('page', String(page.page ?? 0));

        return this.http.get<Pageable<RESUME>>(`${this.endpoint}`, { params: httpParams });
    }

    public listAll(httpParams?: HttpParams): Observable<ListAll<RESUME>> {
        return this.http.get<ListAll<RESUME>>(`${this.endpoint}/todos`, { params: httpParams });
    }

    public insert(data: any): Observable<ListAll<RESPONSE>> {
        return this.http.post<ListAll<RESPONSE>>(this.endpoint, data);
    }

    public update(id: number, data: any): Observable<ListAll<RESPONSE>> {
        return this.http.put<ListAll<RESPONSE>>(`${this.endpoint}/${id}`, data);
    }

    public delete(id: number): Observable<ListAll<RESPONSE>> {
        return this.http.delete<ListAll<RESPONSE>>(`${this.endpoint}/${id}`);
    }

    public deleteSelected(ids: number[]): Observable<ListAll<RESPONSE>> {
        return this.http.delete<ListAll<RESPONSE>>(`${this.endpoint}`, { body: ids });
    }

}
