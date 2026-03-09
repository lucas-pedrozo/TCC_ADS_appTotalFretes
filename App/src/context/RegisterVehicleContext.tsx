import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type VehicleGroupType = "caminhao" | "carreta" | "bitrem";

export type VehicleTypeData = {
	id: number;
	name: string;
	image: string;
	axle: number;
	grossWeight: string;
	length: string;
};

export type VehiclePlateData = {
	plate: string;
	country: string;
	state: string;
	city: string;
};

type RegisterVehicleContextValue = {
	group: VehicleGroupType | null;
	vehicleType: VehicleTypeData | null;
	plateData: VehiclePlateData;

	setGroup: (group: VehicleGroupType) => void;
	setVehicleType: (type: VehicleTypeData) => void;
	setPlateData: (data: VehiclePlateData) => void;

	getPayload: () => { group: VehicleGroupType | null; vehicleType: VehicleTypeData | null } & VehiclePlateData;
	reset: () => void;
};

const defaultPlateData: VehiclePlateData = {
	plate: "",
	country: "",
	state: "",
	city: "",
};

const RegisterVehicleContext = createContext<RegisterVehicleContextValue | undefined>(undefined);

export function RegisterVehicleProvider({ children }: { children: React.ReactNode }) {
	const [group, setGroupState] = useState<VehicleGroupType | null>(null);
	const [vehicleType, setVehicleTypeState] = useState<VehicleTypeData | null>(null);
	const [plateData, setPlateDataState] = useState<VehiclePlateData>(defaultPlateData);

	const setGroup = useCallback((g: VehicleGroupType) => setGroupState(g), []);
	const setVehicleType = useCallback((t: VehicleTypeData) => setVehicleTypeState(t), []);
	const setPlateData = useCallback((d: VehiclePlateData) => setPlateDataState(d), []);

	const reset = useCallback(() => {
		setGroupState(null);
		setVehicleTypeState(null);
		setPlateDataState(defaultPlateData);
	}, []);

	const getPayload = useCallback(
		() => ({ group, vehicleType, ...plateData }),
		[group, vehicleType, plateData],
	);

	const value = useMemo(
		() => ({ group, vehicleType, plateData, setGroup, setVehicleType, setPlateData, getPayload, reset }),
		[group, vehicleType, plateData, setGroup, setVehicleType, setPlateData, getPayload, reset],
	);

	return (
		<RegisterVehicleContext.Provider value={value}>
			{children}
		</RegisterVehicleContext.Provider>
	);
}

export function useRegisterVehicle() {
	const context = useContext(RegisterVehicleContext);
	if (!context) {
		throw new Error("useRegisterVehicle must be used within RegisterVehicleProvider");
	}
	return context;
}