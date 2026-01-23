import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Tutores } from '@/shared/models/tutores';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TutoresService extends AbstractService<Tutores, Tutores> {
    protected override get resource(): string {
        return 'tutores';
    }

    public findTutorById(id: number): Observable<Tutores> {
        return this.http.get(`${this.endpoint}/${id}`);
    }

    public addTutorImage(id: number, foto: File): Observable<Tutores> {
        const formData = new FormData();
        formData.append('foto', foto);

        return this.http.post(`${this.endpoint}/${id}/fotos`, formData);
    }

    public removeTutorImage(tutorId: number, fotoId: number): Observable<Tutores> {
        return this.http.delete(`${this.endpoint}/${tutorId}/fotos/${fotoId}`);
    }

    public bondTutorPet(id: number, petId: number): Observable<Tutores> {
        return this.http.post(`${this.endpoint}/${id}/pets/${petId}`, null);
    }

    public unbondTutorPet(id: number, petId: number): Observable<Tutores> {
        return this.http.delete(`${this.endpoint}/${id}/pets/${petId}`);
    }
}
