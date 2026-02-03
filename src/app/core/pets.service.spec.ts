import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PetsService } from './pets.service';
import { Pets } from '@/shared/models/pets';

describe('PetsService', () => {
    let service: PetsService;
    let httpMock: HttpTestingController;

    const mockPet: Pets = {
        id: 1,
        nome: 'Rex',
        especie: 'Cachorro',
        idade: 3,
        foto: null
    } as Pets;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PetsService]
        });

        service = TestBed.inject(PetsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('deve ser criado', () => {
        expect(service).toBeTruthy();
    });

    describe('findPetById', () => {
        it('deve buscar um pet pelo id', () => {
            service.findPetById(1).subscribe(pet => {
                expect(pet).toEqual(mockPet);
                expect(pet.id).toBe(1);
            });

            const req = httpMock.expectOne(`${service['endpoint']}/1`);
            expect(req.request.method).toBe('GET');

            req.flush(mockPet);
        });
    });

    describe('addPetImage', () => {
        it('deve enviar a imagem do pet via FormData', () => {
            const file = new File(['dummy-image'], 'pet.png', { type: 'image/png' });

            service.addPetImage(1, file).subscribe(pet => {
                expect(pet).toEqual(mockPet);
            });

            const req = httpMock.expectOne(`${service['endpoint']}/1/fotos`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body instanceof FormData).toBeTrue();

            const formData = req.request.body as FormData;
            expect(formData.has('foto')).toBeTrue();

            req.flush(mockPet);
        });
    });

    describe('removePetImage', () => {
        it('deve remover a imagem do pet', () => {
            service.removePetImage(1, 10).subscribe(pet => {
                expect(pet).toEqual(mockPet);
            });

            const req = httpMock.expectOne(`${service['endpoint']}/1/fotos/10`);
            expect(req.request.method).toBe('DELETE');

            req.flush(mockPet);
        });
    });

    describe('tratamento de erro', () => {
        it('deve propagar erro quando a API falhar', () => {
            service.findPetById(999).subscribe({
                next: () => fail('não deveria retornar sucesso'),
                error: error => {
                    expect(error.status).toBe(404);
                }
            });

            const req = httpMock.expectOne(`${service['endpoint']}/999`);
            req.flush(
                { message: 'Pet não encontrado' },
                { status: 404, statusText: 'Not Found' }
            );
        });
    });
});
