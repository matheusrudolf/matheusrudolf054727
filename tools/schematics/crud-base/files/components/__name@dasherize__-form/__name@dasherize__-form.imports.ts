import { ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { TabsModule } from 'primeng/tabs';

export const <%= underscore(name).toUpperCase() %>_FORM_IMPORTS = [
    DialogModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
    FloatLabelModule,
    ReactiveFormsModule,
    DividerModule,
    ReactiveFormsModule,
    TabsModule
]
