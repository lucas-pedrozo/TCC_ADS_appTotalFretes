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

/**
 * @description Retorna a primeira parte de um texto antes do separador (ex.: endereço antes da vírgula).
 * @param texto Texto completo
 * @param separador Caractere separador (padrão: vírgula)
 * @returns Exemplo: "Rua X, Bairro" => "Rua X", "Sem vírgula" => "Sem vírgula"
 */
export function primeiraParte(texto: string, separador = ","): string {
    const parte = texto.trim().split(separador)[0];
    return parte?.trim() ?? texto.trim();
}

type AddressParts = {
    city: string;
    street: string;
    number: string;
};

/**
 * @description Separa um endereço em cidade, rua e número a partir do label vindo da API.
 * @param label Endereço formatado
 * @param emptyText Texto usado quando a informação não existir
 */
export function parseAddressLabel(label?: string | null, emptyText = "---"): AddressParts {
    const cleanLabel = label?.trim();
    if (!cleanLabel) {
        return { city: emptyText, street: emptyText, number: emptyText };
    }

    const parts = cleanLabel.split(",").map((part) => part.trim()).filter(Boolean);
    const numberMatch = cleanLabel.match(/\b\d+[A-Za-z]?\b/);

    if (parts.length === 1) {
        return {
            city: parts[0],
            street: emptyText,
            number: numberMatch?.[0] ?? emptyText,
        };
    }

    return {
        city: parts[parts.length - 2] ?? parts[parts.length - 1] ?? cleanLabel,
        street: parts[0] ?? emptyText,
        number: numberMatch?.[0] ?? emptyText,
    };
}

function stripStateFromCity(token: string): string {
    return token.split(/\s-\s/)[0]?.trim() ?? token.trim();
}

const COUNTRY_LABEL_PATTERN = /^(brazil|brasil|br)$/i;
const CEP_LABEL_PATTERN = /^\d{5}-?\d{3}$/;

function splitCityStateToken(token: string): { city: string; state: string } | null {
    const match = token.match(/^(.+?)\s-\s(.+)$/);
    if (!match) return null;
    return { city: match[1].trim(), state: match[2].trim() };
}

function trimTrailingAddressMeta(parts: string[]): string[] {
    let trimmed = [...parts];
    while (trimmed.length > 0 && COUNTRY_LABEL_PATTERN.test(trimmed[trimmed.length - 1] ?? "")) {
        trimmed = trimmed.slice(0, -1);
    }
    while (trimmed.length > 0 && CEP_LABEL_PATTERN.test(trimmed[trimmed.length - 1] ?? "")) {
        trimmed = trimmed.slice(0, -1);
    }
    return trimmed;
}

/**
 * @description Extrai cidade e estado a partir do label de endereço da API.
 * @returns Exemplo: "Campinas, SP" ou "Campinas, São Paulo"
 */
export function extractCityStateFromAddressLabel(label?: string | null, emptyText = "---"): string {
    const cleanLabel = label?.trim();
    if (!cleanLabel) return emptyText;

    const parts = cleanLabel.split(",").map((part) => part.trim()).filter(Boolean);
    const cityStatePart = parts.find((part) => /\s-\s/.test(part) && !/^\d+$/.test(part));
    if (cityStatePart) {
        const parsed = splitCityStateToken(cityStatePart);
        if (parsed) return `${parsed.city}, ${parsed.state}`;
    }

    const locationParts = trimTrailingAddressMeta(parts);
    if (locationParts.length >= 3) {
        const state = locationParts[locationParts.length - 1];
        const city = locationParts[locationParts.length - 2];
        if (city && state && !/^\d+$/.test(city) && !/^\d+$/.test(state)) {
            return `${stripStateFromCity(city)}, ${state}`;
        }
    }
    if (locationParts.length === 2) {
        const [city, state] = locationParts;
        if (city && state && !/^\d+$/.test(city) && !/^\d+$/.test(state)) {
            return `${stripStateFromCity(city)}, ${state}`;
        }
    }

    return extractCityFromAddressLabel(cleanLabel, emptyText);
}

/**
 * @description Extrai apenas o nome da cidade a partir do label de endereço da API.
 */
export function extractCityFromAddressLabel(label?: string | null, emptyText = "---"): string {
    const cleanLabel = label?.trim();
    if (!cleanLabel) return emptyText;

    const parts = cleanLabel.split(",").map((part) => part.trim()).filter(Boolean);

    if (parts.length <= 2) {
        return stripStateFromCity(parts[0] ?? cleanLabel);
    }

    const cityStatePart = parts.find(
        (part) => /\s-\s/.test(part) && !/^\d+$/.test(part)
    );
    if (cityStatePart) {
        return stripStateFromCity(cityStatePart);
    }

    const middlePart = parts.find(
        (part, index) => index > 0 && index < parts.length - 1 && !/^\d+$/.test(part)
    );
    if (middlePart) {
        return stripStateFromCity(middlePart);
    }

    return stripStateFromCity(parseAddressLabel(cleanLabel, emptyText).city);
}

/**
 * @description Formata peso com unidade para exibição.
 * @param weight Peso em kg
 * @param emptyText Texto usado quando o peso não existir
 */
export function formatWeight(weight?: number | null, emptyText = "---"): string {
    if (weight == null) return emptyText;
    const numeric = Number(weight);
    if (!Number.isFinite(numeric)) return emptyText;
    if (numeric >= 1000) return `${Number(numeric / 1000).toLocaleString("pt-BR")}T`;
    return `${numeric.toLocaleString("pt-BR")} kg`;
}

/**
 * @description Mascara os últimos 5 dígitos do CPF para exibição (privacidade).
 * @param cpf CPF completo (com ou sem formatação: 12345678901 ou 123.456.789-01)
 * @returns CPF com últimos 5 dígitos substituídos por * — ex.: "123.456.***-**"
 */
export function maskCpfUltimosCinco(cpf: string): string {
    const apenasDigitos = cpf.replace(/\D/g, "");

    if (apenasDigitos.length !== 11) {
        return cpf;
    }

    return apenasDigitos.replace(/^(\d{3})(\d{3})\d{5}$/, "$1.$2.***-**");
}
