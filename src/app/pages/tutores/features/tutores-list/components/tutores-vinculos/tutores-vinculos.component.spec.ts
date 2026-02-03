import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutoresVinculosComponent } from './tutores-vinculos.component';
import { PetsService } from '@/core/pets.service';
import { TutoresService } from '@/core/tutores.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { of } from 'rxjs';
import { Tutores } from '@/shared/models/tutores';
import { Pets } from '@/shared/models/pets';
import { Pageable } from '@/shared/classes/pageable';

describe('TutoresVinculosComponent', () => {
    let component: TutoresVinculosComponent;
    let fixture: ComponentFixture<TutoresVinculosComponent>;

    let petsServiceSpy: jasmine.SpyObj<PetsService>;
    let tutoresServiceSpy: jasmine.SpyObj<TutoresService>;
    let dialogUtilSpy: jasmine.SpyObj<DialogUtil>;
    let messageUtilSpy: jasmine.SpyObj<MessageUtil>;

    const tutorMock: Tutores = {
        id: 1,
        nome: 'Tutor Teste'
    } as Tutores;

    const petMock: Pets = {
        id: 10,
        nome: 'Rex',
        raca: 'Vira-lata',
        idade: 3,
        tutores: [tutorMock]
    } as Pets;

    beforeEach(async () => {
        petsServiceSpy = jasmine.createSpyObj('PetsService', [
            'listPageable',
            'findPetById'
        ]);

        tutoresServiceSpy = jasmine.createSpyObj('TutoresService', [
            'bondTutorPet',
            'unbondTutorPet'
        ]);

        dialogUtilSpy = jasmine.createSpyObj('DialogUtil', [
            'customConfirmDialog'
        ]);

        messageUtilSpy = jasmine.createSpyObj('MessageUtil', [
            'success'
        ]);

        await TestBed.configureTestingModule({
            imports: [TutoresVinculosComponent],
            providers: [
                { provide: PetsService, useValue: petsServiceSpy },
                { provide: TutoresService, useValue: tutoresServiceSpy },
                { provide: DialogUtil, useValue: dialogUtilSpy },
                { provide: MessageUtil, useValue: messageUtilSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TutoresVinculosComponent);
        component = fixture.componentInstance;

        component.tutor = tutorMock;

        const page = new Pageable<Pets>();
        page.content = [petMock];

        petsServiceSpy.listPageable.and.returnValue(of(page));
        petsServiceSpy.findPetById.and.returnValue(of(petMock));

        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar a lista de pets no ngOnInit', () => {
        expect(petsServiceSpy.listPageable).toHaveBeenCalled();
        expect(component.page.content.length).toBe(1);
    });

    it('deve atualizar formulário e detectar vínculo ao selecionar pet', () => {
        component.petSelected = petMock;

        component.handlePetSelectedChange();

        expect(component.form.value).toEqual({
            nome: 'Rex',
            raca: 'Vira-lata',
            idade: 3
        });

        expect(component.hasBond).toBeTrue();
    });

    it('deve realizar vínculo entre tutor e pet', () => {
        component.petSelected = petMock;

        dialogUtilSpy.customConfirmDialog.and.callFake((_msg, callback) => callback());
        tutoresServiceSpy.bondTutorPet.and.returnValue(of(void 0));

        spyOn(component.onCancel, 'emit');
        spyOn(component.onRefresh, 'emit');

        component.handleBondPetTutor();

        expect(tutoresServiceSpy.bondTutorPet)
            .toHaveBeenCalledWith(tutorMock.id, petMock.id);

        expect(messageUtilSpy.success)
            .toHaveBeenCalledWith('Vinculo realizado com sucesso!', 'Sucesso');

        expect(component.onCancel.emit).toHaveBeenCalledWith(false);
        expect(component.onRefresh.emit).toHaveBeenCalled();
    });

    it('deve realizar desvínculo entre tutor e pet', () => {
        component.petSelected = petMock;

        dialogUtilSpy.customConfirmDialog.and.callFake((_msg, callback) => callback());
        tutoresServiceSpy.unbondTutorPet.and.returnValue(of(void 0));

        spyOn(component.onCancel, 'emit');
        spyOn(component.onRefresh, 'emit');

        component.handleUnbondPetTutor();

        expect(tutoresServiceSpy.unbondTutorPet)
            .toHaveBeenCalledWith(tutorMock.id, petMock.id);

        expect(messageUtilSpy.success)
            .toHaveBeenCalledWith('Vinculo desfeito com sucesso!', 'Sucesso');

        expect(component.onCancel.emit).toHaveBeenCalledWith(false);
        expect(component.onRefresh.emit).toHaveBeenCalled();
    });
});
