import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ActivatedRouteSnapshot,
    NavigationEnd,
    Router,
    RouterModule,
} from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { BehaviorSubject, filter } from 'rxjs';
import { MenuItem } from 'primeng/api';

interface Breadcrumb {
    label: string;
    url?: string;
}

@Component({
    selector: '[app-breadcrumb]',
    standalone: true,
    imports: [CommonModule, RouterModule, BreadcrumbModule],
    template: `
        <nav class="layout-breadcrumb bg-white dark:bg-zinc-900 p-1 rounded-lg shadow-sm">
            <p-breadcrumb [model]="breadcrumbs$ | async" [home]="home" />
        </nav> `,
})
export class AppBreadcrumb {
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    home: MenuItem | undefined;

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                const root = this.router.routerState.snapshot.root;
                const breadcrumbs: Breadcrumb[] = [];
                this.addBreadcrumb(root, [], breadcrumbs);

                this._breadcrumbs$.next(breadcrumbs);
            });

        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }

    private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
        const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
        const breadcrumb = route.data['breadcrumb'];
        const parentBreadcrumb = route.parent && route.parent.data ? route.parent.data['breadcrumb'] : null;

        if (breadcrumb && breadcrumb !== parentBreadcrumb) {
            if (routeUrl.length > 1) {
                breadcrumbs.push({ label: route.data['breadcrumb'], url: '/' + routeUrl.join('/') });
            } else {
                breadcrumbs.push({ label: route.data['breadcrumb'] });
            }
        }

        if (route.firstChild) {
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
        }
    }
}
