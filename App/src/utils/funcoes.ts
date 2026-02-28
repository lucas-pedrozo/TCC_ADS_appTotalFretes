/**
 * @description Função para tratar o nome completo
 * @param nome Nome completo
 * @returns Nome completo tratado - exemplo: "lucas pedrozo" vira "lucas.P"
 */
export function formatName(nome: string): string {
    const nomeCompleto = nome.trim().split(" ");
    
    if (nomeCompleto.length === 1) {
        return nomeCompleto[0];
    }
    
    return nomeCompleto[0] + "." + nomeCompleto[nomeCompleto.length - 1][0].toUpperCase();
}