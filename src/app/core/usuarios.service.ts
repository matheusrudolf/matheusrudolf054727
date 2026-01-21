import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Usuarios } from '@/shared/models/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends AbstractService<Usuarios, Usuarios> {

    protected override get resource(): string {
        return 'usuarios';
    }

}
