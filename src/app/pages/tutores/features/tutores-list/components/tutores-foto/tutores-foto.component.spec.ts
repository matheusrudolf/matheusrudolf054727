import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutoresFotoComponent } from './tutores-foto.component';
import { TutoresService } from '@/core/tutores.service';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { of } from 'rxjs';
import { Tutores } from '@/shared/models/tutores';

describe('TutoresFotoComponent', () => {
    let component: TutoresFotoComponent;
    let fixture: ComponentFixture<TutoresFotoComponent>;

    let tutoresServiceSpy: jasmine.SpyObj<TutoresService>;
    let dialogUtilSpy: jasmine.SpyObj<DialogUtil>;
    let messageUtilSpy: jasmine.SpyObj<MessageUtil>;

    const fileMock = new File(['image'], 'foto.png', { type: 'image/png' });

    const tutorMock: Tutores = {
        id: 1,
        nome: 'Tutor Teste',
        foto: {
            id: 99,
            url: 'http://fake-url/foto.png'
        }
    } as Tutores;

    beforeEach(async () => {
        tutoresServiceSpy = jasmine.createSpyObj('TutoresService', [
            'addTutorImage',
            'removeTutorImage'
        ]);

        dialogUtilSpy = jasmine.createSpyObj('DialogUtil', [
            'customConfirmDialog'
        ]);

        messageUtilSpy = jasmine.createSpyObj('MessageUtil', [
            'success'
        ]);

        await TestBed.configureTestingModule({
            imports: [TutoresFotoComponent],
            providers: [
                { provide: TutoresService, useValue: tutoresServiceSpy },
                { provide: DialogUtil, useValue: dialogUtilSpy },
                { provide: MessageUtil, useValue: messageUtilSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TutoresFotoComponent);
        component = fixture.componentInstance;

        component.tutor = { ...tutorMock };

        tutoresServiceSpy.addTutorImage.and.returnValue(of(void 0));
        tutoresServiceSpy.removeTutorImage.and.returnValue(of(void 0));

        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve selecionar arquivo ao chamar onFileSelect', () => {
        component.onFileSelect({
            currentFiles: [fileMock]
        });

        expect(component.selectedFile).toBe(fileMock);
    });

    it('deve marcar remoção de imagem existente', () => {
        component.handleRemoveTutorImage();

        expect(component.isRemoving).toBeTrue();
        expect(component.tutorFotoId).toBe(99);
        expect(component.tutor.foto).toBeUndefined();
    });

    it('deve remover imagem antiga e salvar nova imagem ao confirmar', () => {
        component.selectedFile = fileMock;
        component.tutorFotoId = 99;

        dialogUtilSpy.customConfirmDialog.and.callFake((_msg, callback) => callback());

        spyOn(component.onCancel, 'emit');
        spyOn(component.onRefresh, 'emit');

        component.handleConfirmSaveImage();

        expect(tutoresServiceSpy.removeTutorImage)
            .toHaveBeenCalledWith(1, 99);

        expect(tutoresServiceSpy.addTutorImage)
            .toHaveBeenCalledWith(1, fileMock);

        expect(messageUtilSpy.success)
            .toHaveBeenCalledWith('Foto cadastrada com sucesso!', 'Sucesso');

        expect(component.onCancel.emit).toHaveBeenCalledWith(false);
        expect(component.onRefresh.emit).toHaveBeenCalled();
    });
});
