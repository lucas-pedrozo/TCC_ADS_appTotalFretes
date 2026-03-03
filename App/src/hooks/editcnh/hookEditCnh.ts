import { AxiosError } from "axios";
import { useCallback } from "react";
import http from "@/src/service/http";
import { useForm } from "react-hook-form";
import { useAuth } from "@/src/context/AuthContext";
import { validationRules } from "@/src/utils/formValidations";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

export interface EditCnhMap {
	cnhNumber: string;
	issuingAgencyCnh: string;
	cnhType_id: string;
	useGlasses: boolean;
}

export function useHookEditCnh() {
	const { notify } = useAlertDefault();
	const { id } = useAuth();

	const { control, handleSubmit, formState: { errors } } = useForm<EditCnhMap>({
		defaultValues: {
			cnhNumber: "",
			issuingAgencyCnh: "",
			cnhType_id: "",
			useGlasses: false,
		},
	});

	const handleEditCnh = useCallback(async (data: EditCnhMap) => {
		try {
			await notify({
				status: "loading",
				message: "Editando CNH...",
			});

			await http.patch<EditCnhMap>(`/user/${id}`, data);

			await notify({
				status: "success",
				message: "CNH editada com sucesso!",
			});

		} catch (error) {
			notify({
				status: "error",
				message: (error as AxiosError<{ message: string }>).response?.data.message ?? "Erro ao editar CNH",
			});
		}
	}, [notify, id])

	const rules = {
		cnhNumber: validationRules.cnhNumber,
		issuingAgencyCnh: validationRules.issuingAgencyCnh,
		cnhType_id: validationRules.cnhType_id,
		useGlasses: validationRules.useGlasses,
	};

	return {
		control,
		errors,
		rules,
		handleEditCnh,
		handleSubmit,
	}
}