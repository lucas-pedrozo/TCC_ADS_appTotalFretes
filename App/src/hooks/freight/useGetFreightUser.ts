import { useFreightUserContext } from "@/src/context/FreightUserContext";

export type {
	FreightMap,
	CompanyMap,
	CargoMap,
	StatusFreightMap,
	ProposalMap,
} from "@/src/context/FreightUserContext";

export function useGetFreightUser() {
	const { freightUser, isLoading, handleGetFreightUser, invalidateFreightUser } =
		useFreightUserContext();

	return {
		freightUser,
		handleGetFreightUser,
		invalidateFreightUser,
		isLoading,
	};
}
