import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetsRegisterComponent } from './pets-register.component';
import { PetsService } from '@/core/pets.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { of } from 'rxjs';
import { ListAll } from '@/shared/classes/listall';
import { Pets } from '@/shared/models/pets';

describe('PetsRegisterComponent', () => {
    let component: PetsRegisterComponent;
    let fixture: ComponentFixture<PetsRegisterComponent>;

    let petsServiceSpy: jasmine.SpyObj<PetsService>;
    let dialogUtilSpy: jasmine.SpyObj<DialogUtil>;
    let messageUtilSpy: jasmine.SpyObj<MessageUtil>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockResponse: ListAll<Pets> = {
        dados: [
            {
                id: 1,
                nome: 'Bob',
                raca: 'Vira-lata',
                idade: 3,
                tutores: []
            }
        ],
        mensagem: 'Sucesso',
        sucesso: true
    };

    function setupRoute(id?: number) {
        return {
            paramMap: of(convertToParamMap(id ? { id } : {}))
        };
    }

    beforeEach(async () => {
        petsServiceSpy = jasmine.createSpyObj('PetsService', [
            'findPetById',
            'insert',
            'update'
        ]);

        dialogUtilSpy = jasmine.createSpyObj('DialogUtil', [
            'confirmFormDialog'
        ]);

        messageUtilSpy = jasmine.createSpyObj('MessageUtil', ['success']);

        routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        await TestBed.configureTestingModule({
            imports: [PetsRegisterComponent],
            providers: [
                { provide: PetsService, useValue: petsServiceSpy },
                { provide: DialogUtil, useValue: dialogUtilSpy },
                { provide: MessageUtil, useValue: messageUtilSpy },
                { provide: Router, useValue: routerSpy },
                {
                    provide: ActivatedRoute,
                    useValue: setupRoute()
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PetsRegisterComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve iniciar em modo ADD quando não houver id na rota', () => {
        fixture.detectChanges();

        expect(component.state).toBe(CrudStateEnum.add);
    });

    it('deve iniciar em modo EDIT e carregar pet quando houver id na rota', () => {
        const mockPet = {
            id: 1,
            nome: 'Rex',
            raca: 'Labrador',
            idade: 5
        };

        petsServiceSpy.findPetById.and.returnValue(of(mockPet));

        TestBed.overrideProvider(ActivatedRoute, {
            useValue: setupRoute(1)
        });

        fixture = TestBed.createComponent(PetsRegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.state).toBe(CrudStateEnum.edit);
        expect(petsServiceSpy.findPetById).toHaveBeenCalledWith(1);
        expect(component.form.value).toEqual({
            nome: 'Rex',
            raca: 'Labrador',
            idade: 5
        });
    });

    it('deve chamar insert ao salvar em modo ADD', () => {
        component.state = CrudStateEnum.add;
        component.form.setValue({
            nome: 'Bob',
            raca: 'Vira-lata',
            idade: 3
        });

        petsServiceSpy.insert.and.returnValue(of(mockResponse));
        dialogUtilSpy.confirmFormDialog.and.callFake((_state, cb) => cb());

        component.handleSaveData();

        expect(petsServiceSpy.insert).toHaveBeenCalledWith({
            nome: 'Bob',
            raca: 'Vira-lata',
            idade: 3
        });

        expect(messageUtilSpy.success).toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('pets/list');
    });

    it('deve chamar update ao salvar em modo EDIT', () => {
        component.state = CrudStateEnum.edit;
        component.petId = 10;

        component.form.setValue({
            nome: 'Thor',
            raca: 'Husky',
            idade: 4
        });

        petsServiceSpy.update.and.returnValue(of(mockResponse));
        dialogUtilSpy.confirmFormDialog.and.callFake((_state, cb) => cb());

        component.handleSaveData();

        expect(petsServiceSpy.update).toHaveBeenCalledWith(10, {
            nome: 'Thor',
            raca: 'Husky',
            idade: 4
        });

        expect(messageUtilSpy.success).toHaveBeenCalled();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('pets/list');
    });
});
