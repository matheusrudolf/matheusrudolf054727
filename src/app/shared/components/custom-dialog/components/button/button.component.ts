import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'sci-button',
    standalone: false,
    template: ''
})
export class ButtonComponent {
    @Input() position: 'start' | 'center' | 'end';
    @Input() label!: string;
    @Input() icon!: string;
    @Input() tooltip!: string;
    @Input() iconPos: 'right' | 'left' | 'top' | 'bottom';
    @Input() severity: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger';
    @Input() variant: 'text' | 'outlined';
    @Input() size: 'small' | 'large';
    @Input() rounded: boolean = false;
    @Input() raised: boolean = false;
    @Input() disabled: boolean = false;
    @Input() navigation: any;

    @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
}
