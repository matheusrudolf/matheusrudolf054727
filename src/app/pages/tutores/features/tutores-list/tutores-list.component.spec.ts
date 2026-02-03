import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TutoresListComponent } from './tutores-list.component';
import { TutoresService } from '@/core/tutores.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Pageable } from '@/shared/classes/pageable';
import { Tutores } from '@/shared/models/tutores';

describe('TutoresListComponent', () => {
    let component: TutoresListComponent;
    let fixture: ComponentFixture<TutoresListComponent>;

    let tutoresServiceSpy: jasmine.SpyObj<TutoresService>;
    let dialogUtilSpy: jasmine.SpyObj<DialogUtil>;
    let messageUtilSpy: jasmine.SpyObj<MessageUtil>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        tutoresServiceSpy = jasmine.createSpyObj('TutoresService', [
            'listPageable',
            'delete'
        ]);

        dialogUtilSpy = jasmine.createSpyObj('DialogUtil', [
            'confirmRemoveDialog'
        ]);

        messageUtilSpy = jasmine.createSpyObj('MessageUtil', [
            'success'
        ]);

        routerSpy = jasmine.createSpyObj('Router', [
            'navigateByUrl'
        ]);

        await TestBed.configureTestingModule({
            imports: [TutoresListComponent],
            providers: [
                { provide: TutoresService, useValue: tutoresServiceSpy },
                { provide: DialogUtil, useValue: dialogUtilSpy },
                { provide: MessageUtil, useValue: messageUtilSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TutoresListComponent);
        component = fixture.componentInstance;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve buscar tutores e montar menu ao inicializar', () => {
        const pageMock = new Pageable<Tutores>();
        tutoresServiceSpy.listPageable.and.returnValue(of(pageMock));

        component.ngOnInit();

        expect(tutoresServiceSpy.listPageable).toHaveBeenCalled();
        expect(component.menuItens.length).toBe(1);
        expect(component.menuItens[0].label).toBe('Novo');
    });

    it('deve chamar o service e controlar loading em handleGetTutores', fakeAsync(() => {
        const pageMock = new Pageable<Tutores>();
        tutoresServiceSpy.listPageable.and.returnValue(of(pageMock));

        component.handleGetTutores();
        expect(component.loading).toBeTrue();

        tick();

        expect(component.loading).toBeFalse();
        expect(component.page).toBe(pageMock);
    }));

    it('deve aplicar filtro de busca quando search existir', () => {
        const pageMock = new Pageable<Tutores>();
        tutoresServiceSpy.listPageable.and.returnValue(of(pageMock));

        component.search = 'João';
        component.handleGetTutores();

        const params = tutoresServiceSpy.listPageable.calls.argsFor(0)[0];
        expect(params.get('nome')).toBe('João');
    });

    it('deve alterar paginação e buscar novamente', () => {
        const pageMock = new Pageable<Tutores>();
        tutoresServiceSpy.listPageable.and.returnValue(of(pageMock));

        component.handlePageChanges({ page: 2, rows: 10 });

        expect(component.page.page).toBe(2);
        expect(component.page.size).toBe(10);
        expect(tutoresServiceSpy.listPageable).toHaveBeenCalled();
    });

    it('deve remover tutor após confirmação', () => {
        tutoresServiceSpy.delete.and.returnValue(of(void 0));
        tutoresServiceSpy.listPageable.and.returnValue(of(new Pageable()));

        dialogUtilSpy.confirmRemoveDialog.and.callFake((cb: Function) => cb());

        component.handleRemoveTutor(1);

        expect(tutoresServiceSpy.delete).toHaveBeenCalledWith(1);
        expect(messageUtilSpy.success)
            .toHaveBeenCalledWith('Tutor Removido com sucesso!', 'Sucesso');
        expect(tutoresServiceSpy.listPageable).toHaveBeenCalled();
    });

    it('deve abrir modal de foto do tutor', () => {
        const tutor = { id: 1, nome: 'Maria' } as Tutores;

        component.handleOpenTutorFotoModal(tutor);

        expect(component.tutorFotoVisible).toBeTrue();
        expect(component.tutor).toBe(tutor);
    });

    it('deve abrir modal de vínculos do tutor', () => {
        const tutor = { id: 2, nome: 'Carlos' } as Tutores;

        component.handleOpenVinculosModal(tutor);

        expect(component.vinculosVisible).toBeTrue();
        expect(component.tutor).toBe(tutor);
    });
});
