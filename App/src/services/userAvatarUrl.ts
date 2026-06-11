import http from "@/src/services/http";
import { ENV_BASE_URL } from "@env";
import type { MapUser } from "@/src/interfaces";

/**
 * Obtém a URL da foto do usuário.
 * @param userId - ID do usuário.
 * @returns URL da foto do usuário ou undefined em caso de erro.
 */
export async function fetchUserAvatarUrl(userId: number): Promise<string | undefined> {
  try {
    const { data } = await http.get<MapUser>(`/user/${userId}`);
    const path = data?.UserImage?.path;
    if (!path) return undefined;
    const base = ENV_BASE_URL.replace(/\/$/, "");
    const segment = path.replace(/^\/?api\/?/, "");
    return `${base}/${segment}`;
  } catch {
    return undefined;
  }
}
