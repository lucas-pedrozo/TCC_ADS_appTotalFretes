import validator from 'validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { maskDate } from './formMask';
import i18n from '@/src/i18n';

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
 * @param value Valor a ser validado, passando pela mask de data para garantir o formato correto
 * @returns true se o valor for valido, false caso contrario
 */
export const validateBirthDate = (value: string) => {
  const valueDate  = maskDate(value);
  const dataValidated = validator.isDate(valueDate, { format: 'DD/MM/YYYY' });
  return dataValidated;
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
    required: i18n.t("validation.requiredCnh"),
    validate: (value: string) => validateCnhNumber(value) || i18n.t("validation.invalidCnh"),
  },
  name: {
    required: i18n.t("validation.requiredName"), 
    validate: (value: string) => validateName(value) || i18n.t("validation.invalidName"),
  },
  email: {
    required: i18n.t("validation.requiredEmail"),
    validate: (value: string) => validateEmail(value) || i18n.t("validation.invalidEmail"),
  },
  cpf: {
    required: i18n.t("validation.requiredCpf"),
    validate: (value: string) => validateCPF(value) || i18n.t("validation.invalidCpf"),
  },
  cnpj: {
    required: i18n.t("validation.requiredCnpj"),
    validate: (value: string) => validateCNPJ(value) || i18n.t("validation.invalidCnpj"),
  },
  phoneNumber: {
    required: i18n.t("validation.requiredPhone"),
    validate: (value: string) => validatePhone(value) || i18n.t("validation.invalidPhone"),
  },
  birthDate: {
    required: i18n.t("validation.requiredBirthDate"),
    validate: (value: string) => validateBirthDate(value) || i18n.t("validation.invalidBirthDate"),
  },
  cnhType_id: {
    required: i18n.t("validation.requiredTypeCnh"),
    validate: (value: string) => validateTypeCnh(value) || i18n.t("validation.invalidTypeCnh"),
  },
  useGlasses: {
    required: i18n.t("validation.requiredUseGlasses"),
    validate: (value: string) => validateUseGlasses(value) || i18n.t("validation.invalidUseGlasses"),
  },
  isDeficient: {
    required: i18n.t("validation.requiredDisability"),
    validate: (value: string) => validateDisability(value) || i18n.t("validation.invalidDisability"),
  },
  issuingAgencyCnh: {
    required: i18n.t("validation.requiredIssuingAgency"),
    validate: (value: string) => validateIssuingAgencyCnh(value) || i18n.t("validation.invalidIssuingAgency"),
  },
  password: {
    required: i18n.t("validation.requiredPassword"),
    validate: (value: string) => validatePasswordConfirmation(value) || i18n.t("validation.invalidPassword"),
  },
  sex:{
    required: i18n.t("validation.requiredSex"),
    validate: (value: string) => validateSex(value) || i18n.t("validation.invalidSex"),
  },
  confirmPassword: {
    required: i18n.t("validation.requiredConfirmPassword"),
    validate: (value: string, formValues: { password: string }) =>
      validatePasswordConfirmationMatch(value, formValues.password) || i18n.t("validation.invalidConfirmPassword"),
  },
};
