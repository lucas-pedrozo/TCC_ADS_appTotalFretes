import { useCallback, useState } from "react";
import http from "@/src/service/http";
import { AxiosError } from "axios";
import { useAuth } from "@/src/context/AuthContext";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";

export interface mapUser {
	name: string;
	email: string;
	birthDate: string;
	phoneNumber: string;
	cpf: string;
	sex: string;
	useGlasses: boolean;
	issuingAgencyCnh: string;
	isDeficient: boolean;
	cnhNumber: string;
	cnhType_id: number;
	vehicleType_id: number | null;
	userImage_id: number | null;
	
	CnhType: mapCnh;
}

export interface mapCnh {
	id: number;
	name: string;
	description: string;
}

export function useHookGetUser() {
	const { id } = useAuth();
	const { notify } = useAlertDefault();
	const [userData, setUserData] = useState<mapUser | null>(null);

	const handleGetUser = useCallback(async () => {
		try {
			const response = await http.get<mapUser>(`/user/${id}`);
			setUserData(response.data);
		} catch (error) {
			notify({
				status: "error",
				message: (error as AxiosError<{ message: string }>).response?.data.message,
			});
		}
	}, [id, notify]);

	return {
		userData,
		handleGetUser,
	}
}