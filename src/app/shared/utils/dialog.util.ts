import { inject, Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { CrudStateEnum } from '../enums/crud-state.enum';

@Injectable({
    providedIn: 'root'
})
export class DialogUtil {

    private readonly confirmationService = inject(ConfirmationService);

    public confirmFormDialog(state: CrudStateEnum, getReq: () => void): void {
        this.confirmationService.confirm({
            message: state === CrudStateEnum.add ? 'Confirmar o cadastro do registro' : 'Confirmar a alteração do registro',
            header: 'Confirmar',
            icon: 'pi pi-question',
            closable: false,
            accept: () => getReq()
        });
    }

    public confirmRemoveDialog(getReq: () => void): void {
        this.confirmationService.confirm({
            message: 'Deseja remover o registro?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            closable: false,
            accept: () => getReq()
        });
    }

    public confirmRemoveAllDialog(getReq: () => void): void {
        this.confirmationService.confirm({
            message: 'Deseja remover os registros?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            closable: false,
            accept: () => getReq()
        });
    }

    public confirmLogout(getReq: () => void): void {
        this.confirmationService.confirm({
            message: 'Por favor, confirme que deseja sair do sistema.',
            header: 'Confirmar',
            icon: 'pi pi-sign-out',
            closable: false,
            key: 'logout',
            accept: () => getReq()
        });
    }

    public customConfirmDialog(msg: string, getReq: () => void, header?: string, icon?: string): void {
        this.confirmationService.confirm({
            message: msg,
            header: header !== undefined ? header : 'Confirmar',
            icon: icon !== undefined ? `pi pi-${icon}` : 'pi pi-question',
            closable: false,
            accept: () => getReq()
        });
    }

}
