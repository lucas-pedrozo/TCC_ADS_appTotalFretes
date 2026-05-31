import { useCallback, useState } from "react";
import http from "@/src/services/http";
import { getApiErrorMessage } from "@/src/utils/apiError";
import { useAuth } from "@/src/context/AuthContext";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import i18n from "@/src/i18n";

export function useDeleteUser() {
	const { id, logout,lastUsedAccount, removeSavedAccount } = useAuth();
	const { notify } = useAlertDefault();
	const [isdisabled, setIsdisabled] = useState(true);

	const handleRemoveSavedAccount = useCallback(() => {
		if (lastUsedAccount) removeSavedAccount(lastUsedAccount.email);
	}, [lastUsedAccount, removeSavedAccount]);

	const handleDeleteUser = useCallback(async () => {
		try {
			await notify({
				status: "loading",
				message: i18n.t("NOTIFICATIONS.DELETEUSERLOADING"),
			});
			setIsdisabled(true);

			await http.delete(`user/${id}`);
			await notify({
				status: "success",
				message: i18n.t("NOTIFICATIONS.DELETEUSERSUCCESS"),
			});
			handleRemoveSavedAccount();
			logout();
		} catch (error) {
			await notify({
				status: "error",
				message: getApiErrorMessage(error),
			});
		} finally {
			setIsdisabled(false);
		}
	}, [id, logout, notify, handleRemoveSavedAccount]);

	return {
		handleDeleteUser,
		isdisabled,
	};
}
