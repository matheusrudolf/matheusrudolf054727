import { TutoresService } from '@/core/tutores.service';
import { CustomDialogModule } from '@/shared/components/custom-dialog/custom-dialog.module';
import { Tutores } from '@/shared/models/tutores';
import { DialogUtil } from '@/shared/utils/dialog.util';
import { MessageUtil } from '@/shared/utils/message.util';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-tutores-foto',
    standalone: true,
    imports: [CustomDialogModule, FileUploadModule, ButtonModule, TooltipModule, CardModule],
    template: `
        <scx-custom-dialog [visible]="visible" header="Foto do Tutor"
            width="45rem" (onCancel)="onCancel.emit(false)" (onConfirm)="handleConfirmSaveImage()">
            <div class="flex justify-center">
                <p-card class="w-auto md:w-[25rem]" [style]="{ overflow: 'hidden' }">
                    <ng-template #header>
                        @if (tutor?.foto) {
                            <div class="w-full flex justify-end bg-transparent">
                                <p-button icon="pi pi-trash" severity="danger" text rounded
                                    pTooltip="Remover a imagem" (onClick)="handleRemoveTutorImage()" />
                            </div>
                            <img class="w-full" [src]="tutor.foto.url" [alt]="tutor.nome" />
                        } @else {
                            <p-fileupload accept="image/*" [multiple]="false" (onSelect)="onFileSelect($event)">
                                <ng-template #header let-files let-chooseCallback="chooseCallback" let-clearCallback="clearCallback"
                                    let-uploadCallback="uploadCallback">
                                    <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                                        <div class="flex gap-2">
                                            <p-button icon="pi pi-images" severity="secondary" text rounded
                                                pTooltip="Adicionar Foto" (onClick)="chooseCallback()" />
                                        </div>
                                    </div>
                                </ng-template>
                                <ng-template #empty>
                                    <div class="flex items-center justify-center flex-col">
                                        <i class="pi pi-image !text-4xl !text-muted-color"></i>
                                        <p class="mt-6 mb-0">Sem Foto</p>
                                    </div>
                                </ng-template>
                            </p-fileupload>
                        }
                    </ng-template>
                </p-card>
            </div>
        </scx-custom-dialog>
    `
})
export class TutoresFotoComponent {
    private readonly tutorService = inject(TutoresService);
    private readonly dialogUtil = inject(DialogUtil);
    private readonly messageUtil = inject(MessageUtil);

    @Input() visible: boolean = false;
    @Input() tutor: Tutores;

    @Output() onCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onRefresh: EventEmitter<void> = new EventEmitter<void>();

    public selectedFile: File | null = null;
    public isRemoving: boolean = false;
    public tutorFotoId!: number;

    public onFileSelect(event: any): void {
        if (event.currentFiles && event.currentFiles.length > 0) {
            this.selectedFile = event.currentFiles[0];
        }
    }

    public handleRemoveTutorImage(): void {
        this.isRemoving = true;
        this.tutorFotoId = this.tutor.foto.id
        delete this.tutor.foto;
    }

    public handleConfirmSaveImage() {
        this.dialogUtil.customConfirmDialog(`Deseja salvar a foto?`, () => {
            if (this.tutorFotoId) {
                this.tutorService.removeTutorImage(this.tutor.id, this.tutorFotoId).subscribe({
                    next: () => this.tutorFotoId = null
                });
            }

            this.tutorService.addTutorImage(this.tutor.id, this.selectedFile!).subscribe({
                next: () => {
                    this.messageUtil.success(`Foto cadastrada com sucesso!`, 'Sucesso');
                    this.onCancel.emit(false);
                    this.onRefresh.emit();
                }
            });
        });
    }
}
