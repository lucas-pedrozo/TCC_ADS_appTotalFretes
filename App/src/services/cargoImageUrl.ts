import { ENV_BASE_URL } from "@env";

import http from "@/src/services/http";

export interface CargoImageData {
	id: number;
	path?: string;
	url?: string | null;
	originalName?: string | null;
}

export interface CargoTypeWithImage {
	imageCargo_id?: number | null;
	CargoImage?: CargoImageData | null;
}

function buildStorageImageUrl(storagePath: string): string {
	const base = ENV_BASE_URL.replace(/\/$/, "");
	const relative = storagePath
		.replace(/\\/g, "/")
		.replace(/^\/?api\/?/, "")
		.replace(/^\//, "");

	const encoded = relative
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");

	return `${base}/${encoded}`;
}

/**
 * Monta a URL da imagem do tipo de carga (mesmo padrão da foto de perfil).
 */
export function getCargoImageUrl(cargo?: CargoTypeWithImage | null): string | undefined {
	const path = cargo?.CargoImage?.path;
	if (!path) return undefined;
	return buildStorageImageUrl(path);
}

/**
 * Busca a imagem do tipo de carga por ID quando o path não veio no payload.
 */
export async function fetchCargoImageUrl(imageCargoId: number): Promise<string | undefined> {
	try {
		const { data } = await http.get<CargoImageData>(`/cargo-images/${imageCargoId}`);
		const path = data?.path;
		if (!path) return undefined;
		return buildStorageImageUrl(path);
	} catch {
		return undefined;
	}
}
