/**
 * @description Função para tratar o nome completo
 * @param nome Nome completo
 * @returns Nome completo tratado - exemplo: "lucas pedrozo" vira "lucas.P" e se for "lucas pedrozo da silva" vira "lucas.S"
 */
export function formatName(nome: string): string {
  return nome.trim().split(" ")[0] + "." + nome.trim().split(" ")[nome.trim().split(" ").length - 1][0].toUpperCase();
}

/**
 * @description Retorna primeiro e último nome
 * @param nome Nome completo
 * @returns Exemplo: "lucas pedrozo" => "lucas pedrozo", "lucas" => "lucas", "lucas carvalho pedrozo" => "lucas pedrozo"
 */
export function formatNameSobrenome(nome: string): string {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) {
    return "";
  }

  if (partes.length === 1) {
    return partes[0];
  }

  return `${partes[0]} ${partes[partes.length - 1]}`;
}