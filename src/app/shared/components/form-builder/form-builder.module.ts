import { NgModule } from "@angular/core";
import { NgClass } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldsetModule } from "primeng/fieldset";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from "primeng/inputnumber";
import { DatePickerModule } from "primeng/datepicker";
import { SelectModule } from "primeng/select";
import { MultiSelectModule } from "primeng/multiselect";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { FileUploadModule } from "primeng/fileupload";
import { InputMaskModule } from "primeng/inputmask";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from "primeng/button";

import { FormBuilderComponent } from "./form-builder.component";
import { FormGroupComponent } from "./components/form-group/form-group.component";
import { FormItemComponent } from "./components/form-item/form-item.component";

@NgModule({
    declarations: [
        FormBuilderComponent,
        FormGroupComponent,
        FormItemComponent
    ],
    imports: [
        NgClass,
        ReactiveFormsModule,
        FieldsetModule,
        FloatLabelModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        DatePickerModule,
        SelectModule,
        MultiSelectModule,
        CheckboxModule,
        RadioButtonModule,
        FileUploadModule,
        InputMaskModule,
        ToggleSwitchModule,
        FileUploadModule,
        ButtonModule
    ],
    exports: [
        FormBuilderComponent,
        FormGroupComponent,
        FormItemComponent
    ]
})
export class FormBuilderModule {}
