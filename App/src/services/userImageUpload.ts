import http from "@/src/services/http";

export interface UserImageResponse {
  id: number;
  originalName?: string;
  fileName: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
}

export interface UploadUserImageResponse {
  message: string;
  userImage: UserImageResponse;
}

const getMimeTypeFromUri = (uri: string): string => {
  const ext = uri.split(".").pop()?.toLowerCase();
  const mime: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return mime[ext ?? ""] ?? "image/jpeg";
};

const getNameFromUri = (uri: string): string => {
  const parts = uri.split("/");
  const file = parts[parts.length - 1];
  if (file && file.includes(".")) return file;
  const mime = getMimeTypeFromUri(uri);
  const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : mime === "image/gif" ? "gif" : "jpg";
  return `photo.${ext}`;
};

/**
 * Envia a imagem do usuário para o storage-service.
 * Backend espera multipart/form-data com campo `image`.
 */
export async function uploadUserImage(uri: string): Promise<UserImageResponse> {
  const formData = new FormData();
  formData.append("image", {
    uri,
    name: getNameFromUri(uri),
    type: getMimeTypeFromUri(uri),
  } as unknown as Blob);

  const { data } = await http.post<UploadUserImageResponse>("/user-images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.userImage;
}
