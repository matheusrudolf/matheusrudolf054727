import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TutoresService } from './tutores.service';
import { Tutores } from '@/shared/models/tutores';

describe('TutoresService', () => {
    let service: TutoresService;
    let httpMock: HttpTestingController;

    const mockTutor: Tutores = {
        id: 1,
        nome: 'João da Silva',
        email: 'joao@email.com',
        pets: [
            { id: 10, nome: 'Rex' }
        ]
    } as Tutores;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TutoresService]
        });

        service = TestBed.inject(TutoresService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    describe('findTutorById', () => {
        it('deve buscar um tutor pelo id', () => {
            service.findTutorById(1).subscribe(tutor => {
                expect(tutor).toEqual(mockTutor);
                expect(tutor.id).toBe(1);
            });

            const req = httpMock.expectOne(`${service['endpoint']}/1`);
            expect(req.request.method).toBe('GET');

            req.flush(mockTutor);
        });
    });

    describe('addTutorImage', () => {
        it('deve enviar a imagem do tutor via FormData', () => {
            const file = new File(['dummy-image'], 'tutor.png', { type: 'image/png' });

            service.addTutorImage(1, file).subscribe(tutor => {
                expect(tutor).toEqual(mockTutor);
            });

            const req = httpMock.expectOne(`${service['endpoint']}/1/fotos`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body instanceof FormData).toBeTrue();

            const formData = req.request.body as FormData;
            expect(formData.has('foto')).toBeTrue();

            req.flush(mockTutor);
        });
    });

    describe('removeTutorImage', () => {
        it('deve remover a imagem do tutor', () => {
            service.removeTutorImage(1, 5).subscribe(tutor => {
                expect(tutor).toEqual(mockTutor);
            });

            const req = httpMock.expectOne(`${service['endpoint']}/1/fotos/5`);
            expect(req.request.method).toBe('DELETE');

            req.flush(mockTutor);
        });
    });

    describe('bondTutorPet', () => {
        it('deve vincular um pet ao tutor', () => {
            service.bondTutorPet(1, 10).subscribe(tutor => {
                expect(tutor).toEqual(mockTutor);
            });

            const req = httpMock.expectOne(`${service['endpoint']}/1/pets/10`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toBeNull();

            req.flush(mockTutor);
        });
    });

    describe('unbondTutorPet', () => {
        it('deve desvincular um pet do tutor', () => {
            service.unbondTutorPet(1, 10).subscribe(tutor => {
                expect(tutor).toEqual(mockTutor);
            });

            const req = httpMock.expectOne(`${service['endpoint']}/1/pets/10`);
            expect(req.request.method).toBe('DELETE');

            req.flush(mockTutor);
        });
    });

    describe('tratamento de erro', () => {
        it('deve propagar erro quando a API retornar erro', () => {
            service.findTutorById(999).subscribe({
                next: () => fail('não deveria retornar sucesso'),
                error: error => {
                    expect(error.status).toBe(404);
                }
            });

            const req = httpMock.expectOne(`${service['endpoint']}/999`);
            req.flush(
                { message: 'Tutor não encontrado' },
                { status: 404, statusText: 'Not Found' }
            );
        });
    });
});
