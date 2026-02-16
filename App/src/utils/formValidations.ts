import validator from 'validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

/**
 * @description Validacao de nome
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateFullName = (value: string) => {
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
  return validator.isDate(value, { format: 'DD/MM/YYYY' }) && validator.isBefore(value, new Date().toISOString());
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
export const validateTypeCnh = (value: string) => {
  return validator.isLength(value, { min: 1, max: 2 });
};

/**
 * @description Validacao de sim ou nao
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateGlasses = (value: string) => {
  return validator.isIn(value, ['sim', 'nao']);
};

/**
 * @description Validacao de orgao emissor
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateIssuingAgencyCnh = (value: string) => {
  return validator.isLength(value, { min: 1, max: 2 });
};

/**
 * @description Validacao de senha
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validatePasswordConfirmation = (value: string) => {
  return validator.isLength(value, { min: 8, max: 16 });
};

/**
 * @description Validacao de sexo
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateGender = (value: string) => {
  return validator.isIn(value, ['masculino', 'feminino']);
};

/**
 * @description Validacao de senha
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validatePasswordConfirmationMatch = (value: string, confirmValue: string) => {
  return value === confirmValue;
};

/**
 * @description Objeto com todas as regras de validacao do react-hook-form
 */
export const validationRules = {
  cnh: {
    required: "CNH e obrigatoria",
    validate: validateCNH,
  },
  fullName: {
    required: "Nome e obrigatorio", 
    validate: validateFullName,
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
  phoneNumber: {
    required: "Numero de telefone e obrigatorio",
    validate: validatePhone,
  },
  birthDate: {
    required: "Data de nascimento e obrigatoria",
    validate: validateBirthDate,
  },
  fullNameCnh: {
    required: "Nome completo da CNH e obrigatorio",
    validate: validateCNH,
  },
  typeCnh: {
    required: "Categoria de CNH e obrigatoria",
    validate: validateTypeCnh,
  },
  glasses: {
    required: "Este campo e obrigatorio",
    validate: validateGlasses,
  },
  disability: {
    required: "Este campo e obrigatorio",
    validate: validateGender,
  },
  issuingAgency: {
    required: "Orgao emissor e obrigatorio",
    validate: validateIssuingAgencyCnh,
  },
  password: {
    required: "Senha e obrigatoria",
    validate: validatePasswordConfirmation,
  },
  gender:{
    required: "Sexo e obrigatorio",
  },
  confirmPassword: {
    required: "Confirmacao de senha e obrigatoria",
    validate: validatePasswordConfirmationMatch,
  },
};
