/**
 * Traduções usadas nos hooks: apenas loading e success.
 * Chaves em UPPERCASE: NOTIFICATIONS.LOGINLOADING
 * Mensagens de erro vêm do backend (não traduzir aqui).
 */

export const hookPT = {
  NOTIFICATIONS: {
    LOGINLOADING: "Efetuando login...",
    LOGINSUCCESS: "Login efetuado com sucesso!",
    SIGNUPLOADING: "Criando conta...",
    SIGNUPSUCCESS: "Conta criada com sucesso!",
    CODEVALIDATIONLOADING: "Validando código...",
    CODEVALIDATED: "Código validado com sucesso!",
    FORGOTPASSWORDLOADING: "Enviando código de verificação...",
    FORGOTPASSWORDSUCCESS: "Se o email estiver cadastrado, você receberá o código.",
    NEWPASSWORDLOADING: "Alterando senha...",
    NEWPASSWORDSUCCESS: "Senha alterada com sucesso!",
    EDITPERFILLOADING: "Editando perfil...",
    EDITPERFILSUCCESS: "Perfil editado com sucesso!",
    EDITCNHLOADING: "Editando CNH...",
    EDITCNHSUCCESS: "CNH editada com sucesso!",
    NOCONNECTION: "Sem conexão. Conecte-se à internet para entrar.",
    TOKENINVALID: "Sessão expirada. Faça login com sua senha.",
  },
} as const;

export const hookEN = {
  NOTIFICATIONS: {
    LOGINLOADING: "Signing in...",
    LOGINSUCCESS: "Signed in successfully!",
    SIGNUPLOADING: "Creating account...",
    SIGNUPSUCCESS: "Account created successfully!",
    CODEVALIDATIONLOADING: "Validating code...",
    CODEVALIDATED: "Code validated successfully!",
    FORGOTPASSWORDLOADING: "Sending verification code...",
    FORGOTPASSWORDSUCCESS: "If the email is registered, you will receive the code.",
    NEWPASSWORDLOADING: "Changing password...",
    NEWPASSWORDSUCCESS: "Password changed successfully!",
    EDITPERFILLOADING: "Editing profile...",
    EDITPERFILSUCCESS: "Profile updated successfully!",
    EDITCNHLOADING: "Editing driver license...",
    EDITCNHSUCCESS: "Driver license updated successfully!",
    NOCONNECTION: "No connection. Connect to the internet to sign in.",
    TOKENINVALID: "Session expired. Sign in with your password.",
  },
} as const;
