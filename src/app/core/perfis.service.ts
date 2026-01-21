import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Perfis } from '@/shared/models/perfis';

@Injectable({
    providedIn: 'root'
})
export class PerfisService extends AbstractService<Perfis, Perfis> {

    protected override get resource(): string {
        return 'perfils';
    }

}
