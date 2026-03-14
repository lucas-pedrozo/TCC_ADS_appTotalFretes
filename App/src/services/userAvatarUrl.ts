import http from "@/src/services/http";
import { ENV_BASE_URL } from "@env";
import type { MapUser } from "@/src/interfaces";

/**
 * URL pública da foto do usuário (para card na Start / conta salva).
 * Falha silenciosa: login não deve depender disso.
 */
export async function fetchUserAvatarUrl(userId: number): Promise<string | undefined> {
  try {
    const { data } = await http.get<MapUser>(`/user/${userId}`);
    const path = data?.UserImage?.path;
    return path ? `${ENV_BASE_URL}/api/${path}` : undefined;
  } catch {
    return undefined;
  }
}
