import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import http from "@/src/services/http";
import i18n from "@/src/i18n";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { MapVehicle } from "@/src/interfaces";
import type { RootStackParamList } from "@/src/routes/Routes";

export interface EditVehicleFormData {
	plate: string;
	chassisNumber: string;
	model: string;
	mark: string;
	country: string;
	state: string;
	city: string;
}

interface UseEditVehicleOptions {
	vehicleId: number;
	defaultValues?: Partial<EditVehicleFormData>;
	onSuccess?: () => void;
}

export function useEditVehicle({ vehicleId, defaultValues, onSuccess }: UseEditVehicleOptions) {
	const { notify } = useAlertDefault();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	const { control, handleSubmit, formState: { errors } } = useForm<EditVehicleFormData>({
		mode: "onSubmit",
		defaultValues,
	});

	const handleEditVehicle = useCallback(async (data: EditVehicleFormData) => {
		try {
			notify({
				status: "loading",
				message: i18n.t("NOTIFICATIONS.EDITVEHICLELOADING"),
			});

			const payload: Partial<MapVehicle> = {
				plateNumber: data.plate.replace(/[^A-Za-z0-9]/g, "").toUpperCase(),
				chassisNumber: data.chassisNumber.replace(/\s/g, "").toUpperCase(),
				model: data.model.trim(),
				mark: data.mark.trim(),
				city: data.city.trim(),
				stateUF: data.state.trim(),
				country: data.country.trim(),
			};

			await http.patch(`vehicle/${vehicleId}`, payload);

			await notify({
				status: "success",
				message: i18n.t("NOTIFICATIONS.EDITVEHICLESUCCESS"),
			});

			onSuccess?.();
			navigation.goBack();
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
			notify({
				status: "error",
				message: message || i18n.t("NOTIFICATIONS.ERROR"),
			});
		}
	}, [notify, vehicleId, onSuccess, navigation]);

	const rules = {
		plate: { required: i18n.t("VALIDATION.REQUIREDPLATE") },
		chassisNumber: { required: i18n.t("VALIDATION.REQUIREDCHASSIS") },
		model: { required: i18n.t("VALIDATION.REQUIREDMODEL") },
		mark: { required: i18n.t("VALIDATION.REQUIREDMARK") },
		country: { required: i18n.t("VALIDATION.REQUIREDCOUNTRY") },
		state: { required: i18n.t("VALIDATION.REQUIREDSTATE") },
		city: { required: i18n.t("VALIDATION.REQUIREDCITY") },
	};

	return {
		control,
		handleSubmit,
		handleEditVehicle,
		errors,
		rules,
	};
}
