import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import http from "@/src/services/http";
import i18n from "@/src/i18n";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import type { RootStackParamList } from "@/src/routes/Routes";

export function useDeleteVehicle() {
	const { notify } = useAlertDefault();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [isLoading, setIsLoading] = useState(false);

	const handleDeleteVehicle = useCallback(async (vehicleId: number) => {
		try {
			setIsLoading(true);

			notify({
				status: "loading",
				message: i18n.t("NOTIFICATIONS.DELETEVEHICLELOADING"),
			});

			await http.delete(`vehicle/${vehicleId}`);

			await notify({
				status: "success",
				message: i18n.t("NOTIFICATIONS.DELETEVEHICLESUCCESS"),
			});

			navigation.navigate("Home");
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
			notify({
				status: "error",
				message: message || i18n.t("NOTIFICATIONS.ERROR"),
			});
		} finally {
			setIsLoading(false);
		}
	}, [notify, navigation]);

	return {
		handleDeleteVehicle,
		isLoading,
	};
}
