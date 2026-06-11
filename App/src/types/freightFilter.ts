export type FreightFilterOrder = "proximo" | "longe";

export type FreightFilterValue = "todos" | "menores" | "maiores";

export type FreightFilterState = {
	order: FreightFilterOrder;
	value: FreightFilterValue;
};

export const DEFAULT_FREIGHT_FILTER_STATE: FreightFilterState = {
	order: "proximo",
	value: "todos",
};
