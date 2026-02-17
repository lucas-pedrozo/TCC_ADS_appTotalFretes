/**
 * @description Máscara de formatação de CPF
 * @param value Valor a ser formatado
 * @returns Valor formatado
 */
export const maskCpf = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+$/, '$1'); 
};

/**
 * @description Máscara de formatação de telefone
 * @param value Valor a ser formatado
 * @returns Valor formatado
 */
export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+$/, '$1'); 
};

/**
 * @description Máscara de formatação de CEP
 * @param value Valor a ser formatado
 * @returns Valor formatado
 */
export const maskCep = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+$/, '$1'); 
};

/**
 * @description Máscara de formatação de data
 * @param value Valor a ser formatado
 * @returns Valor formatado
 */
export const maskDate = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})\d+$/, '$1'); 
};