import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AccessDeniedComponent } from "./accessdenied/accessdenied.component";
import { ForgetpasswordComponent } from "./forgetpassword/forgetpassword.component";

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'access-denied',
        component: AccessDeniedComponent
    },
    {
        path: 'forget-password',
        component: ForgetpasswordComponent
    }
]
