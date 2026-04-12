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

/**
 * @description Máscara de formatação de placa (padrão brasileiro: 7 caracteres, Mercosul ou antigo)
 * @param value Valor a ser formatado
 * @returns Valor formatado como ABC-1234 (antigo) ou ABC1D23 (Mercosul)
 */
export const maskPlate = (value: string) => {
  const cleaned = value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 7);

  if (cleaned.length <= 3) return cleaned;

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
};


export function maskEmailForDisplay(email: string): string {
	const trimmed = email.trim();
	if (!trimmed) return "***";
	const atIndex = trimmed.indexOf("@");
	if (atIndex <= 0) return "***";
	const local = trimmed.slice(0, atIndex);
	const domain = trimmed.slice(atIndex);
	const visible = local.length <= 2 ? local : local.slice(0, 2);
	return `${visible}***${domain}`;
}