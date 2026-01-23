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

    public addPetImage(id: number, foto: File): Observable<Pets> {
        const formData = new FormData();
        formData.append('foto', foto);

        return this.http.post(`${this.endpoint}/${id}/fotos`, formData);
    }

    public removePetImage(petId: number, fotoId: number): Observable<Pets> {
        return this.http.delete(`${this.endpoint}/${petId}/fotos/${fotoId}`);
    }
}
