import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import http from "@/src/services/http";
import i18n from "@/src/i18n";

type CreateProposalBody = {
	freight_id: number;
	value: number;
	submitted_lat: number;
	submitted_lng: number;
};

type CreateProposalResponse = {
	message: string;
	proposal: {
		id: number;
		freight_id: number;
		driver_id: number;
		status_id: number | null;
		value: number;
		createdAt?: string;
		updatedAt?: string;
	};
};

export function useCreateProposal() {
	const { notify } = useAlertDefault();
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateProposal = useCallback(async (body: CreateProposalBody) => {
		try {
			setIsLoading(true);
			const { data } = await http.post<CreateProposalResponse>("proposal", body);
			await notify({
				status: "success",
				message: data.message,
			});
			return data.proposal;
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? i18n.t("NOTIFICATIONS.ERROR");
			notify({ status: "error", message });
		} finally {
			setIsLoading(false);
		}
	}, [notify]);

	return {
		isLoading,
		handleCreateProposal,
	};
}
