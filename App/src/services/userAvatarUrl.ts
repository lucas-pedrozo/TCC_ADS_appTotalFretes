import http from "@/src/services/http";
import { ENV_BASE_URL } from "@env";
import type { MapUser } from "@/src/interfaces";

/** GET /user/:id e monta URL da foto; ENV_BASE_URL já inclui /api, evita duplicar. */
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
