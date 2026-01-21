import { CrudStateEnum } from '@/shared/enums/crud-state.enum';
import { AfterViewInit, Component, ContentChildren, forwardRef, inject, Input, QueryList, signal } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { FormItemComponent } from './components/form-item/form-item.component';
import { FORM_CONTEXT, FormContext } from './form-context';
import { FormGroupComponent } from './components/form-group/form-group.component';

@Component({
    selector: 'scx-form',
    standalone: false,
    providers: [
        {
            provide: ControlContainer,
            useExisting: forwardRef(() => FormBuilderComponent)
        },
        {
            provide: FORM_CONTEXT,
            useExisting: forwardRef(() => FormBuilderComponent)
        }
    ],
    template: `
        <form [formGroup]="form" [ngClass]="{ 'grid grid-cols-12 gap-6 p-4' : groups.length === 0 }" class="mt-5">
            <ng-content />
        </form>
    `
})
export class FormBuilderComponent extends ControlContainer implements AfterViewInit, FormContext {
    @Input({ required: true }) form!: FormGroup;

    @Input()
    set state(value: CrudStateEnum) {
        this._state.set(value);
    }

    readonly(): boolean {
        return this._state() === CrudStateEnum.view;
    }

    private _state = signal<CrudStateEnum>(CrudStateEnum.add);

    @ContentChildren(FormGroupComponent)
    groups!: QueryList<FormGroupComponent>;

    @ContentChildren(FormItemComponent)
    items!: QueryList<FormItemComponent>;

    override get control(): FormGroup {
        return this.form;
    }

    override get formDirective(): FormGroupDirective | null {
        return null;
    }

    override get path(): string[] {
        return [];
    }

    ngAfterViewInit(): void {
        const hasGroups = this.groups.length > 0;
        const hasItems = this.items.length > 0;

        if (!hasGroups && !hasItems) {
            throw new Error(
                '[SciForm] Deve conter ao menos um sci-form-group ou sci-form-item'
            );
        }

        if (hasGroups) {
            const orphanItems = this.items.filter(
                item => !item.group
            );

            if (orphanItems.length) {
                console.warn(
                    '[SciForm] sci-form-item fora de sci-form-group será ignorado.',
                    orphanItems
                );
            }
        }
    }
}
