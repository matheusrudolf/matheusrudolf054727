import { Component } from '@angular/core';
import { <%= underscore(name).toUpperCase() %>_FILTER_IMPORTS } from './<%= dasherize(name) %>-filter.imports';

@Component({
    selector: 'app-<%= dasherize(name) %>-filter',
    standalone: true,
    imports: [<%= underscore(name).toUpperCase() %>_FILTER_IMPORTS],
    template: ``
})
export class <%= classify(name) %>FilterComponent { }
