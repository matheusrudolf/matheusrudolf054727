import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Pets } from '@/shared/models/pets';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PetsService extends AbstractService<Pets, Pets> {
    protected override get resource(): string {
        return 'pets';
    }

    public findPetById(id: number): Observable<Pets> {
        return this.http.get(`${this.endpoint}/${id}`);
    }
}
