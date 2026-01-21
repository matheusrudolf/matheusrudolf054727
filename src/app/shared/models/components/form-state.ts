import { CrudStateEnum } from "@/shared/enums/crud-state.enum";

export interface FormStateType<T> {
    visible: boolean;
    state: CrudStateEnum;
    formData: T;
}
