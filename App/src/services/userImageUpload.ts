import { ENV_BASE_URL } from "@env";
import i18n from "@/src/i18n";
import { getActiveAuthToken, getRequestLanguage } from "@/src/services/http";

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

export type PickedUserImage = {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
};

const UPLOAD_TIMEOUT_MS = 60_000;
const getMimeTypeFromUri = (uri: string): string => {
  const ext = uri.split(".").pop()?.toLowerCase();
  const mime: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/jpeg",
    heif: "image/jpeg",
  };
  return mime[ext ?? ""] ?? "image/jpeg";
};

const getNameFromImage = (image: PickedUserImage): string => {
  if (image.fileName?.trim()) return image.fileName.trim();

  const parts = image.uri.split("/");
  const file = parts[parts.length - 1];
  if (file && file.includes(".")) return file;

  const mime = image.mimeType?.trim() || getMimeTypeFromUri(image.uri);
  const ext =
    mime === "image/png" ? "png"
      : mime === "image/webp" ? "webp"
        : mime === "image/gif" ? "gif"
          : "jpg";
  return `photo.${ext}`;
};

const getMimeType = (image: PickedUserImage): string =>
  image.mimeType?.trim() || getMimeTypeFromUri(image.uri);

const buildUploadUrl = () => {
  const base = `${ENV_BASE_URL}`.replace(/\/+$/, "");
  return `${base}/user-images/upload`;
};

const logUploadError = (step: string, details: Record<string, unknown>) => {
  console.error("[userImageUpload]", step, details);
};

class UploadHttpError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const message = status === 429
      ? i18n.t("NOTIFICATIONS.IMAGEUPLOADRATELIMIT")
      : typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as { message?: unknown }).message === "string"
        ? (body as { message: string }).message
        : i18n.t("NOTIFICATIONS.IMAGEUPLOADFAILED");
    super(message);
    this.status = status;
    this.body = body;
  }
}

type XhrUploadResult = {
  status: number;
  body: string;
};

/** XHR envia Authorization + FormData de forma confiável no Android (fetch/okhttp pode omitir o header). */
function uploadWithXhr(
  url: string,
  formData: FormData,
  token: string,
): Promise<XhrUploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const timeoutId = setTimeout(() => {
      xhr.abort();
      reject(new Error("XHR_UPLOAD_TIMEOUT"));
    }, UPLOAD_TIMEOUT_MS);

    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("accept-language", getRequestLanguage());

    xhr.onload = () => {
      clearTimeout(timeoutId);
      resolve({ status: xhr.status, body: xhr.responseText ?? "" });
    };

    xhr.onerror = () => {
      clearTimeout(timeoutId);
      logUploadError("xhr.onerror", { url, readyState: xhr.readyState, status: xhr.status });
      reject(new Error("XHR_UPLOAD_NETWORK_ERROR"));
    };

    xhr.onabort = () => {
      clearTimeout(timeoutId);
      reject(new Error("XHR_UPLOAD_ABORTED"));
    };

    xhr.send(formData);
  });
}

function buildFormData(image: PickedUserImage, ownerId: number): FormData {
  const formData = new FormData();
  formData.append("image", {
    uri: image.uri,
    name: getNameFromImage(image),
    type: getMimeType(image),
  } as unknown as Blob);
  formData.append("ownerType", "USER");
  formData.append("ownerId", String(ownerId));
  return formData;
}

/**
 * Envia a imagem para POST /api/user-images/upload.
 */
export async function uploadUserImage(
  image: PickedUserImage,
  ownerId: number,
  authToken?: string | null,
): Promise<UserImageResponse> {
  const tokenFromContext = authToken ?? null;
  const token = tokenFromContext ?? await getActiveAuthToken();
  const uploadUrl = buildUploadUrl();

  if (!token) {
    logUploadError("abort.no-token", { ownerId, uploadUrl });
    throw new Error(i18n.t("NOTIFICATIONS.TOKENINVALID"));
  }

  const formData = buildFormData(image, ownerId);

  try {
    const { status, body } = await uploadWithXhr(uploadUrl, formData, token);

    let data: UploadUserImageResponse | { message?: string } = {};
    if (body) {
      try {
        data = JSON.parse(body) as UploadUserImageResponse;
      } catch {
        data = { message: body };
      }
    }

    if (status < 200 || status >= 300) {
      throw new UploadHttpError(status, data);
    }

    if (!("userImage" in data) || !data.userImage) {
      logUploadError("abort.invalid-payload", { status, data });
      throw new Error(i18n.t("NOTIFICATIONS.IMAGEUPLOADFAILED"));
    }

    return data.userImage;
  } catch (error) {
    if (error instanceof UploadHttpError) {
      logUploadError("http-error", { status: error.status, message: error.message });
      throw error;
    }
    if (error instanceof Error && error.message === "XHR_UPLOAD_TIMEOUT") {
      logUploadError("timeout", { uploadUrl, ownerId });
      throw new Error(i18n.t("NOTIFICATIONS.IMAGEUPLOADTIMEOUT"));
    }
    logUploadError("unexpected-error", {
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
