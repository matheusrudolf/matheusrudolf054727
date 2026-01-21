import { Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { CrudStateEnum } from '@/shared/enums/crud-state.enum';

@Component({
    selector: 'scx-custom-dialog',
    standalone: false,
    template: `
        <p-dialog [(visible)]="visible" [header]="header" [style]="{ width }"
            [closable]="false" [draggable]="false" modal>
            <ng-content />
            <ng-template #footer>
                <div class="w-full">
                    <p-divider />
                    @if (hasCustomFooter) {
                        <div class="flex justify-between">
                            <!-- START -->
                            <div class="flex justify-start gap-2">
                                @for (item of startItems; track $index) {
                                    <p-button [label]="item.label" [icon]="item.icon" [iconPos]="item.iconPos"
                                        [severity]="item.severity" [variant]="item.variant" [size]="item.size"
                                        [rounded]="item.rounded" [raised]="item.raised" [disabled]="item.disabled"
                                        [pTooltip]="item.tooltip" [routerLink]="item.navigation" (onClick)="item.onClick.emit()" />
                                }
                            </div>
                            <!-- CENTER -->
                            <div class="flex justify-center gap-2">
                                @for (item of centerItems; track $index) {
                                    <p-button [label]="item.label" [icon]="item.icon" [iconPos]="item.iconPos"
                                        [severity]="item.severity" [variant]="item.variant" [size]="item.size"
                                        [rounded]="item.rounded" [raised]="item.raised" [disabled]="item.disabled"
                                        [pTooltip]="item.tooltip" [routerLink]="item.navigation" (onClick)="item.onClick.emit()" />
                                }
                            </div>
                            <!-- END -->
                            <div class="flex justify-end gap-2">
                                @for (item of endItems; track $index) {
                                    <p-button [label]="item.label" [icon]="item.icon" [iconPos]="item.iconPos"
                                        [severity]="item.severity" [variant]="item.variant" [size]="item.size"
                                        [rounded]="item.rounded" [raised]="item.raised" [disabled]="item.disabled"
                                        [pTooltip]="item.tooltip" [routerLink]="item.navigation" (onClick)="item.onClick.emit()" />
                                }
                            </div>
                        </div>
                    } @else {
                        <div class="flex justify-end gap-2">
                            @if (state !== CrudStateEnum.view) {
                                <p-button label="Confirmar" severity="secondary" [disabled]="confirmDisable" outlined
                                    (onClick)="onDefaultConfirm()" />
                            }
                            <p-button label="Cancelar" severity="danger" (onClick)="onDefaultCancel()" />
                        </div>
                    }
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class CustomDialogComponent {
    @Input() visible: boolean = false;
    @Input() header: string;
    @Input() width: string = '30rem';
    @Input() confirmDisable: boolean = false;
    @Input() state!: CrudStateEnum;

    @Output() onVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onConfirm: EventEmitter<void> = new EventEmitter<void>();
    @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

    @ContentChildren(ButtonComponent)
    buttonItems!: QueryList<ButtonComponent>;

    public readonly CrudStateEnum = CrudStateEnum;

    get hasCustomFooter(): boolean {
        return this.buttonItems?.length > 0;
    }

    get startItems() {
        return this.buttonItems?.filter(i => i.position === 'start') ?? [];
    }

    get centerItems() {
        return this.buttonItems?.filter(i => i.position === 'center') ?? [];
    }

    get endItems() {
        return this.buttonItems?.filter(i => i.position === 'end') ?? [];
    }

    public onDefaultConfirm(): void {
        this.onConfirm.emit();
        this.handleCloseDialog();
    }

    public onDefaultCancel(): void {
        this.onCancel.emit();
        this.handleCloseDialog();
    }

    private handleCloseDialog(): void {
        this.onVisibleChange.emit(false);
    }
}
