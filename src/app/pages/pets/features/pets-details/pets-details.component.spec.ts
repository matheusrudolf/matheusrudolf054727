import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PetsDetailsComponents } from './pets-details.component';
import { PetsService } from '@/core/pets.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { Pets } from '@/shared/models/pets';
import { Tutores } from '@/shared/models/tutores';

describe('PetsDetailsComponents', () => {
    let component: PetsDetailsComponents;
    let fixture: ComponentFixture<PetsDetailsComponents>;

    let petsServiceSpy: jasmine.SpyObj<PetsService>;
    let dialogUtilSpy: jasmine.SpyObj<DialogUtil>;
    let messageUtilSpy: jasmine.SpyObj<MessageUtil>;

    const mockPet: Pets = {
        id: 1,
        nome: 'Rex',
        idade: 3,
        raca: 'Labrador',
        foto: {
            id: 10,
            url: 'foto.jpg'
        },
        tutores: [
            {
                id: 1,
                nome: 'João',
                email: 'joao@email.com',
                telefone: '99999-9999',
                endereco: 'Rua A',
                cpf: 12345678900,
                foto: null
            } as Tutores
        ]
    } as Pets;

    beforeEach(async () => {
        petsServiceSpy = jasmine.createSpyObj('PetsService', [
            'findPetById',
            'addPetImage',
            'removePetImage'
        ]);

        dialogUtilSpy = jasmine.createSpyObj('DialogUtil', ['customConfirmDialog']);
        messageUtilSpy = jasmine.createSpyObj('MessageUtil', ['success']);

        await TestBed.configureTestingModule({
            imports: [PetsDetailsComponents],
            providers: [
                {
                    provide: PetsService,
                    useValue: petsServiceSpy
                },
                {
                    provide: DialogUtil,
                    useValue: dialogUtilSpy
                },
                {
                    provide: MessageUtil,
                    useValue: messageUtilSpy
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({
                            params: { id: 1 }
                        })
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PetsDetailsComponents);
        component = fixture.componentInstance;

        petsServiceSpy.findPetById.and.returnValue(of(mockPet));
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve buscar o pet pelo id vindo da rota', () => {
        expect(petsServiceSpy.findPetById).toHaveBeenCalledWith(1);
        expect(component.petData).toEqual(mockPet);
    });

    it('deve preencher o formulário ao selecionar um tutor', () => {
        component.selectedTutor = mockPet.tutores[0];
        component.handleChangesFormTutor();

        expect(component.form.value).toEqual({
            nome: 'João',
            email: 'joao@email.com',
            telefone: '99999-9999',
            endereco: 'Rua A',
            cpf: '123.456.789-00'
        });
    });

    it('deve definir o arquivo selecionado no upload', () => {
        const file = new File(['teste'], 'foto.png');

        component.onFileSelect({
            currentFiles: [file]
        });

        expect(component.selectedFile).toBe(file);
    });

    it('deve fazer upload da imagem após confirmação', () => {
        const file = new File(['teste'], 'foto.png');
        component.selectedFile = file;
        component.petData = mockPet;

        petsServiceSpy.addPetImage.and.returnValue(of(mockPet));

        dialogUtilSpy.customConfirmDialog.and.callFake(
            (_msg: string, accept: () => void) => accept()
        );

        component.uploadEvent(jasmine.createSpy('clearCallback'));

        expect(petsServiceSpy.addPetImage)
            .toHaveBeenCalledWith(1, file);

        expect(messageUtilSpy.success)
            .toHaveBeenCalledWith('Foto cadastrada com sucesso!', 'Sucesso');
    });

    it('deve remover a imagem do pet após confirmação', () => {
        component.petData = mockPet;

        petsServiceSpy.removePetImage.and.returnValue(of(mockPet));

        dialogUtilSpy.customConfirmDialog.and.callFake(
            (_msg: string, accept: () => void) => accept()
        );

        component.handleRemovePetImage();

        expect(petsServiceSpy.removePetImage)
            .toHaveBeenCalledWith(1, 10);

        expect(messageUtilSpy.success)
            .toHaveBeenCalledWith('Foto removida com sucesso!', 'Sucesso');
    });
});
