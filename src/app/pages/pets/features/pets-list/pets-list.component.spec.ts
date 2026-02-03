import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PetsListComponent } from './pets-list.component';
import { PetsService } from '@/core/pets.service';
import { Pageable } from '@/shared/classes/pageable';
import { Pets } from '@/shared/models/pets';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PetsListComponent', () => {
    let component: PetsListComponent;
    let fixture: ComponentFixture<PetsListComponent>;
    let petsServiceSpy: jasmine.SpyObj<PetsService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockPage: Pageable<Pets> = {
        content: [
            { id: 1, nome: 'Rex' } as Pets,
            { id: 2, nome: 'Mia' } as Pets
        ],
        page: 0,
        size: 10,
        total: 2
    } as Pageable<Pets>;

    beforeEach(async () => {
        petsServiceSpy = jasmine.createSpyObj<PetsService>('PetsService', [
            'listPageable'
        ]);

        petsServiceSpy.listPageable.and.returnValue(of(mockPage));

        routerSpy = jasmine.createSpyObj<Router>('Router', [
            'navigateByUrl'
        ]);

        await TestBed.configureTestingModule({
            imports: [
                PetsListComponent,
                NoopAnimationsModule
            ],
            providers: [
                { provide: PetsService, useValue: petsServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PetsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges(); // ngOnInit
    });

    it('deve ser criado', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar pets ao inicializar', () => {
        expect(petsServiceSpy.listPageable).toHaveBeenCalled();
        expect(component.page.content.length).toBe(2);
        expect(component.loading).toBeFalse();
    });

    it('deve ativar e desativar loading ao buscar pets', () => {
        component.loading = false;

        component.handleGetPets();

        expect(component.loading).toBeFalse(); // finalize executa
        expect(petsServiceSpy.listPageable).toHaveBeenCalled();
    });

    it('deve aplicar filtro com debounce', fakeAsync(() => {
        component.search = 'Rex';

        component.filterSubject$.next('Rex');

        tick(499);
        expect(petsServiceSpy.listPageable).toHaveBeenCalledTimes(1); // só o ngOnInit

        tick(1);
        expect(petsServiceSpy.listPageable).toHaveBeenCalledTimes(2);
    }));

    it('deve atualizar página e tamanho ao paginar', () => {
        component.handlePageChanges({
            page: 1,
            rows: 20
        } as any);

        expect(component.page.page).toBe(1);
        expect(component.page.size).toBe(20);
        expect(petsServiceSpy.listPageable).toHaveBeenCalled();
    });

    it('deve montar corretamente os itens do menu', () => {
        expect(component.menuItens.length).toBe(2);

        const novoItem = component.menuItens[0];
        expect(novoItem.label).toBe('Novo');

        const mockEvent = {
            originalEvent: new MouseEvent('click'),
            item: novoItem
        } as any;

        novoItem.command?.(mockEvent);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/pets/add');
    });

    it('deve alterar layout para list via menu', () => {
        const layoutMenu = component.menuItens[1].items!;
        const listItem = layoutMenu.find(item => item.label === 'Lista')!;

        const mockEvent = {
            originalEvent: new MouseEvent('click'),
            item: listItem
        } as any;

        listItem.command?.(mockEvent);

        expect(component.layout).toBe('list');
    });

    it('deve alterar layout para grid via menu', () => {
        const layoutMenu = component.menuItens[1].items!;
        const gridItem = layoutMenu.find(item => item.label === 'Cards')!;

        const mockEvent = {
            originalEvent: new MouseEvent('click'),
            item: gridItem
        } as any;

        gridItem.command?.(mockEvent);

        expect(component.layout).toBe('grid');
    });
});
