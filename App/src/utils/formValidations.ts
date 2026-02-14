import validator from 'validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

/**
 * @description Validacao de nome
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateName = (value: string) => {
  return validator.isLength(value, { min: 2, max: 100 }) && validator.matches(value, /^[a-zA-Z\s]+$/);
};

/**
 * @description Validacao de email
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateEmail = (value: string) => {
  return validator.isEmail(value);
};

/**
 * @description Validacao de CPF
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateCPF = (value: string) => {
  return cpf.isValid(value);
};

/**
 * @description Validacao de CNPJ
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateCNPJ = (value: string) => {
  return cnpj.isValid(value);
};

/**
 * @description Validacao de telefone
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validatePhone = (value: string) => {
  return validator.isMobilePhone(value, 'pt-BR');
};

/**
 * @description Validacao de data de nascimento
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateBirthDate = (value: string) => {
  return validator.isDate(value, { format: 'DD/MM/YYYY' });
};

/**
 * @description Validacao de CNH
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateCNH = (value: string) => {
  return validator.isLength(value, { min: 11, max: 11 });
};

/**
 * @description Validacao de categoria de CNH
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateCNHCategory = (value: string) => {
  return validator.isLength(value, { min: 1, max: 2 });
};

/**
 * @description Validacao de sim ou nao
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateYesNo = (value: string) => {
  return validator.isIn(value, ['sim', 'nao']);
};

/**
 * @description Validacao de orgao emissor
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateIssuingAgency = (value: string) => {
  return validator.isLength(value, { min: 1, max: 2 });
};

/**
 * @description Validacao de senha
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validatePassword = (value: string) => {
  return validator.isLength(value, { min: 8, max: 16 });
};

/**
 * @description Validacao de sexo
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateSex = (value: string) => {
  return validator.isIn(value, ['masculino', 'feminino']);
};

/**
 * @description Validacao de senha
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validatePasswordMatch = (value: string, confirmValue: string) => {
  return value === confirmValue;
};

/**
 * @description Objeto com todas as regras de validacao do react-hook-form
 */
export const validationRules = {
  nome: {
    required: "Nome e obrigatorio",
    validate: validateName,
  },
  email: {
    required: "Email e obrigatorio",
    validate: validateEmail,
  },
  cpf: {
    required: "CPF e obrigatorio",
    validate: validateCPF,
  },
  cnpj: {
    required: "CNPJ e obrigatorio",
    validate: validateCNPJ,
  },
  numeroTelefone: {
    required: "Numero de telefone e obrigatorio",
    validate: validatePhone,
  },
  dataNascimento: {
    required: "Data de nascimento e obrigatoria",
    validate: validateBirthDate,
  },
  cnh: {
    required: "CNH e obrigatoria",
    validate: validateCNH,
  },
  tipoCnh: {
    required: "Categoria de CNH e obrigatoria",
    validate: validateCNHCategory,
  },
  oculos: {
    required: "Este campo e obrigatorio",
    validate: validateYesNo,
  },
  deficiencia: {
    required: "Este campo e obrigatorio",
    validate: validateYesNo,
  },
  orgaoEmissor: {
    required: "Orgao emissor e obrigatorio",
    validate: validateIssuingAgency,
  },
  senha: {
    required: "Senha e obrigatoria",
    validate: validatePassword,
  },
  sexo:{
    required: "Sexo e obrigatorio",
  },
  confirmarSenha: {
    required: "Confirmacao de senha e obrigatoria",
  },
};
