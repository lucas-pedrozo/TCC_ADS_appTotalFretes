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
  return validator.isDate(value, { format: 'DD/MM/YYYY' }) && validator.isBefore(value, new Date().toISOString());
};

/**
 * @description Validacao de CNH
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateCnhNumber = (value: string) => {
  return validator.isLength(value, { min: 11, max: 11 });
};

/**
 * @description Validacao de categoria de CNH
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateTypeCnh = (value: string) => {
  return validator.isInt(value, { min: 1, max: 5 });
};

/**
 * @description Validacao de sim ou nao
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateUseGlasses = (value: string) => {
  return validator.isBoolean(value);
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
export const validateSex = (value: string) => {
  return validator.isIn(value, ['M', 'F', 'N']);
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
 * @description Validacao de deficiencia
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateDisability = (value: string) => {
  return validator.isBoolean(value);
};

/**
 * @description Objeto com todas as regras de validacao do react-hook-form
 */
export const validationRules = {
  cnhNumber: {
    required: "CNH e obrigatoria",
    validate: validateCnhNumber,
  },
  name: {
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
  phoneNumber: {
    required: "Numero de telefone e obrigatorio",
    validate: validatePhone,
  },
  birthDate: {
    required: "Data de nascimento e obrigatoria",
    validate: validateBirthDate,
  },
  typeCnh: {
    required: "Categoria de CNH e obrigatoria",
    validate: validateTypeCnh,
  },
  useGlasses: {
    required: "Este campo e obrigatorio",
    validate: validateUseGlasses,
  },
  isDeficient: {
    required: "Este campo e obrigatorio",
    validate: validateDisability,
  },
  issuingAgencyCnh: {
    required: "Orgao emissor e obrigatorio",
    validate: validateIssuingAgencyCnh,
  },
  password: {
    required: "Senha e obrigatoria",
    validate: validatePasswordConfirmation,
  },
  sex:{
    required: "Sexo e obrigatorio",
    validate: validateSex,
  },
  confirmPassword: {
    required: "Confirmacao de senha e obrigatoria",
    validate: validatePasswordConfirmationMatch,
  },
};
