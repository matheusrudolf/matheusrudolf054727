import { InjectionToken } from "@angular/core";

export interface FormContext {
    readonly: () => boolean;
}

export const FORM_CONTEXT = new InjectionToken<FormContext>('FORM_CONTEXT');
