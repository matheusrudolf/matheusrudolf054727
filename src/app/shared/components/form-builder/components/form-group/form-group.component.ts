import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { FormItemComponent } from '../form-item/form-item.component';

@Component({
    selector: 'sci-form-group',
    standalone: false,
    template: `
        <p-fieldset [legend]="legend">
            <div class="grid grid-cols-12 gap-6 p-4">
                <ng-content />
            </div>
        </p-fieldset>
    `
})
export class FormGroupComponent {
    @Input({ required: true }) legend!: string;

    @ContentChildren(FormItemComponent)
    items!: QueryList<FormItemComponent>;
}
