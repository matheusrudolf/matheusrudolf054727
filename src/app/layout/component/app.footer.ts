import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Template by
        <a href="https://github.com/solutions-softworks" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Solution Softworks</a>
    </div>`
})
export class AppFooter {}
