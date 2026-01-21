import { NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule } from "lucide-angular";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { PopoverModule } from "primeng/popover";
import { SplitButtonModule } from "primeng/splitbutton";
import { TieredMenuModule } from "primeng/tieredmenu";
import { TooltipModule } from "primeng/tooltip";

export const TOOLBARCONTAINER_IMPORTS = [
    NgClass,
    FormsModule,
    ButtonModule,
    TooltipModule,
    FloatLabelModule,
    InputTextModule,
    TieredMenuModule,
    SplitButtonModule,
    IconFieldModule,
    InputIconModule,
    LucideAngularModule,
    PopoverModule,
    MultiSelectModule
];
