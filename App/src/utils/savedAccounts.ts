import * as SecureStore from "expo-secure-store";

const KEY_SAVED_ACCOUNTS = "savedAccounts";
const KEY_LAST_USED_ACCOUNT = "lastUsedAccountEmail";

export interface SavedAccount {
  email: string;
  displayLabel: string;
}

/**
 * Gera rótulo de exibição mascarado para o email (ex.: Lu***@gmail.com).
 */
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

export async function getSavedAccounts(): Promise<SavedAccount[]> {
  try {
    const raw = await SecureStore.getItemAsync(KEY_SAVED_ACCOUNTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedAccount =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as SavedAccount).email === "string" &&
        typeof (item as SavedAccount).displayLabel === "string"
    );
  } catch {
    return [];
  }
}

export async function setSavedAccounts(accounts: SavedAccount[]): Promise<void> {
  await SecureStore.setItemAsync(KEY_SAVED_ACCOUNTS, JSON.stringify(accounts));
}

export async function getLastUsedAccountEmail(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(KEY_LAST_USED_ACCOUNT);
  } catch {
    return null;
  }
}

export async function setLastUsedAccountEmail(email: string | null): Promise<void> {
  if (email === null || email === "") {
    await SecureStore.deleteItemAsync(KEY_LAST_USED_ACCOUNT);
  } else {
    await SecureStore.setItemAsync(KEY_LAST_USED_ACCOUNT, email);
  }
}

/**
 * Adiciona ou atualiza uma conta na lista e define como última usada.
 */
export async function addOrUpdateSavedAccount(email: string, displayLabel: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const label = displayLabel.trim() || maskEmailForDisplay(normalizedEmail);
  const accounts = await getSavedAccounts();
  const existing = accounts.findIndex((a) => a.email.toLowerCase() === normalizedEmail);
  const newEntry: SavedAccount = { email: normalizedEmail, displayLabel: label };
  const next =
    existing >= 0
      ? accounts.map((a, i) => (i === existing ? newEntry : a))
      : [newEntry, ...accounts];
  await setSavedAccounts(next);
  await setLastUsedAccountEmail(normalizedEmail);
}

export async function removeSavedAccount(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = await getSavedAccounts().then((list) =>
    list.filter((a) => a.email.toLowerCase() !== normalizedEmail)
  );
  await setSavedAccounts(accounts);
  const last = await getLastUsedAccountEmail();
  if (last?.toLowerCase() === normalizedEmail) {
    const newLast = accounts[0]?.email ?? null;
    await setLastUsedAccountEmail(newLast);
  }
}
