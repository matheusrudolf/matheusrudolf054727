import { NgModule } from "@angular/core";
import { CustomDialogComponent } from "./custom-dialog.component";
import { ButtonComponent } from "./components/button/button.component";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { NgClass } from "@angular/common";
import { TooltipModule } from "primeng/tooltip";
import { RouterLink } from "@angular/router";
import { DividerModule } from "primeng/divider";

@NgModule({
    declarations: [
        CustomDialogComponent,
        ButtonComponent
    ],
    imports: [
        NgClass,
        RouterLink,
        DialogModule,
        ButtonModule,
        TooltipModule,
        DividerModule
    ],
    exports: [
        CustomDialogComponent,
        ButtonComponent
    ]
})
export class CustomDialogModule {}
