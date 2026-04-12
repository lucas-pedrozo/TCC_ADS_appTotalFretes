import * as SecureStore from "expo-secure-store";
import { maskEmailForDisplay } from "./formMask";

const KEY_SAVED_ACCOUNTS = "savedAccounts";
const KEY_LAST_USED_ACCOUNT = "lastUsedAccountEmail";

export interface SavedAccount {
	email: string;
	displayLabel: string;
	userImageUrl?: string;
}

/**
 * Converte um item JSON em um objeto SavedAccount.
 * @param item Item JSON a ser convertido.
 * @returns Objeto SavedAccount ou null se o item não for válido.
 */
function toSavedAccount(item: string): SavedAccount | null {
	try {
		const parsed = JSON.parse(item) as SavedAccount;
		const { email, displayLabel, userImageUrl } = parsed;

		if (typeof email !== "string" || typeof displayLabel !== "string") {
			return null;
		}

		return {
			email,
			displayLabel,
			userImageUrl: typeof userImageUrl === "string" ? userImageUrl : undefined,
		};
	} catch (error) {
		console.error("[savedAccounts] Falha ao converter item JSON em SavedAccount:", error);
		return null;
	}
}

/**
 * Obtém a lista de contas salvas do SecureStore.
 * @returns Lista de contas salvas ou array vazio se não houver contas.
 */
export async function getSavedAccounts(): Promise<SavedAccount[]> {
	try {
		const raw = await SecureStore.getItemAsync(KEY_SAVED_ACCOUNTS);
		if (!raw) return [];

		const parsed = JSON.parse(raw) as unknown[];
		if (!Array.isArray(parsed)) return [];

		return parsed
			.map((item) => toSavedAccount(JSON.stringify(item)))
			.filter((account): account is SavedAccount => account !== null);
	} catch {
		return [];
	}
}

/**
 * Salva a lista de contas salvas no SecureStore.
 * @param accounts Lista de contas salvas a serem salvas.
 * @throws Erro se a lista não puder ser salva.
 */
export async function setSavedAccounts(accounts: SavedAccount[]): Promise<void> {
	try {
		await SecureStore.setItemAsync(KEY_SAVED_ACCOUNTS, JSON.stringify(accounts));
	} catch (error) {
		console.error("[savedAccounts] Falha ao salvar contas:", error);
		throw error;
	}
}

/**
 * Obtém o e-mail da última conta utilizada, ou null se não houver nenhuma.
 * @returns E-mail da última conta utilizada ou null se não houver nenhuma.
 */
export async function getLastUsedAccountEmail(): Promise<string | null> {
	try {
		return await SecureStore.getItemAsync(KEY_LAST_USED_ACCOUNT);
	} catch {
		return null;
	}
}


/**
 * Define (ou apaga) o e-mail da última conta usada.
 * @param email E-mail da última conta utilizada ou null para apagar.
 * @throws Erro se o e-mail não puder ser salvo.
 */
export async function setLastUsedAccountEmail(email: string | null): Promise<void> {
	try {
		if (!email) {
			await SecureStore.deleteItemAsync(KEY_LAST_USED_ACCOUNT);
		} else {
			await SecureStore.setItemAsync(KEY_LAST_USED_ACCOUNT, email);
		}
	} catch (error) {
		console.error("[savedAccounts] Falha ao salvar última conta:", error);
		throw error;
	}
}

/** Insere ou atualiza conta por e-mail; última conta fica no topo da lista. */
export async function addOrUpdateSavedAccount({ email, displayLabel, userImageUrl }: SavedAccount): Promise<void> {
	const normalizedEmail = email.trim().toLowerCase();
	const label = displayLabel.trim() || maskEmailForDisplay(normalizedEmail);

	const accounts = await getSavedAccounts();

	const filtered = accounts.filter(
		(a) => a.email.toLowerCase() !== normalizedEmail
	);

	const newEntry: SavedAccount = {
		email: normalizedEmail,
		displayLabel: label,
		userImageUrl,
	};

	// Conta mais recente sempre no índice 0
	await setSavedAccounts([newEntry, ...filtered]);
	await setLastUsedAccountEmail(normalizedEmail);
}

/**
 * Remove uma conta pelo e-mail e atualiza a "última usada" se necessário.
 */
export async function removeSavedAccount(email: string): Promise<void> {
	const normalizedEmail = email.trim().toLowerCase();

	const accounts = await getSavedAccounts();
	const remaining = accounts.filter(
		(a) => a.email.toLowerCase() !== normalizedEmail
	);

	await setSavedAccounts(remaining);

	const last = await getLastUsedAccountEmail();
	if (last?.toLowerCase() === normalizedEmail) {
		await setLastUsedAccountEmail(remaining[0]?.email ?? null);
	}
}