export interface ResetPassword {
    sucesso: boolean;
    mensagem: string;
    email: string;
    codigoValido: boolean;
    usuarioId: number;
}

export interface NewPassword {
    email: string;
    codigo: string;
    novaSenha: string;
    confirmarSenha: string;
}
