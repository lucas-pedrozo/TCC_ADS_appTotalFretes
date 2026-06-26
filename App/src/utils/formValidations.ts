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
  return validator.isLength(value, { min: 2, max: 100 }) && /^[\p{L}\s]+$/u.test(value);
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
 * @description Validacao de CNH | não oficial só para fins de teste e para apresentação do projeto, não deve ser usado em produção
 * @param value Valor a ser validado
 * @returns true se o valor for valido, false caso contrario
 */
export const validateCnhNumber = (value: string): boolean => {
  const cnh = value.replace(/\D/g, '');

  if (!validator.isLength(cnh, { min: 11, max: 11 })) return false;
  if (!validator.isNumeric(cnh)) return false;
  if (/^(\d)\1+$/.test(cnh)) return false;

  let sum = 0;
  for (let i = 0, j = 9; i < 9; i++, j--) {
    sum += Number(cnh[i]) * j;
  }

  let firstDigit = sum % 11;
  let st = 0;
  if (firstDigit >= 10) { firstDigit = 0; st = 2; }

  sum = 0;
  for (let i = 0, j = 1; i < 9; i++, j++) {
    sum += Number(cnh[i]) * j;
  }

  let secondDigit = sum % 11;
  if (secondDigit >= 10 || st === 2) secondDigit = 0;

  return firstDigit === Number(cnh[9]) && secondDigit === Number(cnh[10]);
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
export const validatePassword = (value: string): boolean => {
  const hasMinLength = value.length >= 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);

  return hasMinLength && hasUpperCase && hasLowerCase;
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
 * @description Getter que retorna regras de validação com traduções avaliadas no momento de uso,
 * garantindo que a troca de idioma atualize as mensagens corretamente.
 */
export const getValidationRules = () => ({
  cnhNumber: {
    required: i18n.t("VALIDATION.REQUIREDCNH"),
    validate: (value: string) => validateCnhNumber(value) || i18n.t("VALIDATION.INVALIDCNH"),
  },
  name: {
    required: i18n.t("VALIDATION.REQUIREDNAME"),
    validate: (value: string) => validateName(value) || i18n.t("VALIDATION.INVALIDNAME"),
  },
  email: {
    required: i18n.t("VALIDATION.REQUIREDEMAIL"),
    validate: (value: string) => validateEmail(value) || i18n.t("VALIDATION.INVALIDEMAIL"),
  },
  cpf: {
    required: i18n.t("VALIDATION.REQUIREDCPF"),
    validate: (value: string) => validateCPF(value) || i18n.t("VALIDATION.INVALIDCPF"),
  },
  cnpj: {
    required: i18n.t("VALIDATION.REQUIREDCNPJ"),
    validate: (value: string) => validateCNPJ(value) || i18n.t("VALIDATION.INVALIDCNPJ"),
  },
  phoneNumber: {
    required: i18n.t("VALIDATION.REQUIREDPHONE"),
    validate: (value: string) => validatePhone(value) || i18n.t("VALIDATION.INVALIDPHONE"),
  },
  birthDate: {
    required: i18n.t("VALIDATION.REQUIREDBIRTHDATE"),
    validate: (value: string) => validateBirthDate(value) || i18n.t("VALIDATION.INVALIDBIRTHDATE"),
  },
  cnhType_id: {
    required: i18n.t("VALIDATION.REQUIREDTYPECNH"),
    validate: (value: string) => validateTypeCnh(value) || i18n.t("VALIDATION.INVALIDTYPECNH"),
  },
  useGlasses: {
    validate: (value: string) => {
      if (value === undefined || value === null || value === "") return i18n.t("VALIDATION.REQUIREDUSEGLASSES");
      return validateUseGlasses(String(value)) || i18n.t("VALIDATION.INVALIDUSEGLASSES");
    },
  },
  isDeficient: {
    validate: (value: string) => {
      if (value === undefined || value === null || value === "") return i18n.t("VALIDATION.REQUIREDDISABILITY");
      return validateDisability(String(value)) || i18n.t("VALIDATION.INVALIDDISABILITY");
    },
  },
  issuingAgencyCnh: {
    required: i18n.t("VALIDATION.REQUIREDISSUINGAGENCY"),
    validate: (value: string) => validateIssuingAgencyCnh(value) || i18n.t("VALIDATION.INVALIDISSUINGAGENCY"),
  },
  loginPassword: {
    required: i18n.t("VALIDATION.REQUIREDPASSWORD"),
  },
  currentPassword: {
    required: i18n.t("VALIDATION.REQUIREDPASSWORD"),
  },
  password: {
    required: i18n.t("VALIDATION.REQUIREDPASSWORD"),
    validate: (value: string) => validatePassword(value) || i18n.t("VALIDATION.INVALIDPASSWORD"),
  },
  sex: {
    required: i18n.t("VALIDATION.REQUIREDSEX"),
    validate: (value: string) => validateSex(value) || i18n.t("VALIDATION.INVALIDSEX"),
  },
  confirmPassword: {
    required: i18n.t("VALIDATION.REQUIREDCONFIRMPASSWORD"),
    validate: (value: string, formValues: { password: string }) =>
      validatePasswordConfirmationMatch(value, formValues.password) || i18n.t("VALIDATION.INVALIDCONFIRMPASSWORD"),
  },
  code: {
    required: i18n.t("FORGOTPASSWORDCODE.CODEREQUIRED"),
    minLength: {
      value: 6,
      message: i18n.t("FORGOTPASSWORDCODE.CODEMINLENGTH"),
    },
  },
});
