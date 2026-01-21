import { ImageUtil } from '@/shared/utils/image.util';
import { Component, computed, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroupComponent } from '../form-group/form-group.component';
import { FORM_CONTEXT } from '../../form-context';
import { FormControl } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';

@Component({
    selector: 'sci-form-item',
    standalone: false,
    template: `
        @if (useFloatLabel()) {
            <p-floatlabel>
                @switch (type) {
                    @case ('text') {
                        <input type="text" pInputText [formControl]="formControl"
                            [readonly]="readonly()" fluid />
                    }
                    @case ('textarea') {
                        <textarea pInputTextarea [formControl]="formControl"
                            [readonly]="readonly()" fluid>
                        </textarea>
                    }
                    @case ('number') {
                        <p-inputnumber [mode]="mode" [currency]="currency"
                            [locale]="locale" [formControl]="formControl"
                            [useGrouping]="useGrouping" [readonly]="readonly()" fluid />
                    }
                    @case ('date') {
                        <p-datepicker [formControl]="formControl" dateFormat="dd/mm/yy"
                            showIcon showButtonBar [readonlyInput]="readonly()" fluid />
                    }
                    @case ('select') {
                        <p-select [options]="options" [optionLabel]="optionLabel"
                            [optionValue]="optionValue" [formControl]="formControl"
                            [readonly]="readonly()" (onChange)="onChange.emit($event)"
                            (onShow)="onShow.emit($event)" filter fluid appendTo="body" />
                    }
                    @case ('multiselect') {
                        <p-multiselect [options]="options" [optionLabel]="optionLabel"
                            [optionValue]="optionValue" [formControl]="formControl"
                            [readonly]="readonly()" (onChange)="onChange.emit($event)"
                            (onShow)="onShow.emit($event)" filter fluid appendTo="body" />
                    }
                    @case ('inputmask') {
                        <p-inputmask [mask]="mask" [formControl]="formControl" [readonly]="readonly()"
                            (onComplete)="onComplete.emit($event)" unmask fluid />
                    }
                }
                <label [for]="control">{{ label }}</label>
            </p-floatlabel>
        } @else if (!useFloatLabel() && type !== 'file') {
            <div class="flex items-center gap-2">
                @switch (type) {
                    @case ('checkbox') {
                        <p-checkbox [name]="control" [value]="value" [formControl]="formControl"
                            [binary]="binary" [indeterminate]="indeterminate" [readonly]="readonly()" />
                    }
                    @case ('radio') {
                        <p-radiobutton [name]="control" [value]="value" [formControl]="formControl" />
                    }
                    @case ('switch') {
                        <p-toggleswitch [formControl]="formControl" [readonly]="readonly()" />
                    }
                }
                @if (label) {
                    <label [for]="control">{{ label }}</label>
                }
            </div>
        } @else {
            <p-fileupload #upload name="demo[]" [accept]="accept" [maxFileSize]="maxFileSize" mode="advanced"
                [fileLimit]="fileLimit" [multiple]="multiple" [disabled]="readonly()" (onSelect)="onSelect.emit($event)">
                <ng-template #header let-files let-chooseCallback="chooseCallback" let-clearCallback="clearCallback" let-uploadCallback="uploadCallback">
                    <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                        <div class="flex gap-2">
                            <p-button label="Selecionar" icon="pi pi-images" severity="secondary"
                                [disabled]="disabledSelect || readonly()" (onClick)="chooseCallback()" />
                            <p-button label="Cancelar" icon="pi pi-times" severity="secondary"
                                [disabled]="!files || files.length === 0 || disabledCancel" (onClick)="clearCallback()" />
                        </div>
                    </div>
                </ng-template>
                <ng-template #empty>
                    <div class="flex items-center justify-center flex-col gap-4">
                        <i class="pi pi-image !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"></i>
                        <p class="mt-6 mb-0">Arraste e solte o arquivo aqui para fazer o upload.</p>
                    </div>
                </ng-template>
            </p-fileupload>
        }
    `
})
export class FormItemComponent implements OnInit {
    @ViewChild('upload', { static: false }) upload: FileUpload;

    private readonly imageUtil = new ImageUtil;

    @Input({ required: true }) control!: string;
    @Input() float: boolean = true;
    @Input() label!: string;
    @Input() type:
        | 'text'
        | 'textarea'
        | 'number'
        | 'date'
        | 'select'
        | 'multiselect'
        | 'checkbox'
        | 'radio'
        | 'file'
        | 'inputmask'
        | 'switch' = 'text';

    @Input() disabled: boolean = false;

    //number
    @Input() mode: 'decimal' | 'currency';
    @Input() currency!: string;
    @Input() locale!: string;
    @Input() useGrouping: boolean = true;

    // Select / Multi
    @Input() options: any[] = [];
    @Input() optionLabel?: string;
    @Input() optionValue?: string;

    // Checkbox / Radio
    @Input() binary: boolean = false;
    @Input() indeterminate: boolean = false;
    @Input() value!: any;

    // InputMask
    @Input() mask?: string;

    // File
    @Input() accept!: string;
    @Input() maxFileSize!: string;
    @Input() fileLimit!: string;
    @Input() multiple: boolean = false;
    @Input() disabledSelect: boolean = false;
    @Input() disabledCancel: boolean = false;

    // Events
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    @Output() onShow: EventEmitter<any> = new EventEmitter<any>();
    @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

    public readonly formContext = inject(FORM_CONTEXT);
    public readonly group = inject(FormGroupComponent, { optional: true });
    public readonly = computed(() => this.formContext.readonly());

    public formControl!: FormControl;

    ngOnInit(): void {
        const form = (this.formContext as any).form;

        if (!form) {
            throw new Error(
                `[SciForm] FormGroup não encontrado no contexto. ` +
                `Verifique se o componente sci-form-item está dentro de um scx-form.`
            );
        }

        const control = form.get(this.control);

        if (!control) {
            throw new Error(
                `[SciForm] Control "${this.control}" não encontrado no FormGroup. ` +
                `Controles disponíveis: ${Object.keys(form.controls).join(', ')}`
            );
        }

        this.formControl = control as FormControl;

        if (this.disabled) {
            this.formControl.disable();
        }
    }

    public isRequired(): boolean {
        if (!this.formControl) return false;

        const validator = this.formControl.validator;
        if (!validator) return false;

        const validation = validator({} as any);
        return validation && validation['required'];
    }

    public useFloatLabel(): boolean {
        return !['checkbox', 'radio', 'switch', 'file'].includes(this.type);
    }
}
