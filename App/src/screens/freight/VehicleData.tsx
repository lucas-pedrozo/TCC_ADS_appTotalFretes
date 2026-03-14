import { Image, Text, View } from "react-native";
import { useThemeColors } from "@/src/context/ThemeContext";
import { InputDefault, InputPlate, ButtonDefault } from "@/src/components/form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useRegisterVehicle } from "@/src/hooks/vehicle/useRegisterVehicle";
import { useRegisterVehicleContext } from "@/src/context/RegisterVehicleContext";


const VehicleData = () => {
	const colors = useThemeColors();
	const { control, handleSubmit, handleRegisterVehicle, rules } = useRegisterVehicle();
	const { vehicleType, plateData } = useRegisterVehicleContext();

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
		>
			<Text className="pl-2.5 pb-4" style={{ color: colors.text }}>Informe os dados do veículo</Text>

			<View className="items-center mb-4">
				{vehicleType?.image ? (
					<Image
						source={{ uri: vehicleType?.image }}
						className="w-[260px] h-[140px]"
						resizeMode="contain"
					/>
				) : (
					<Image
						source={require("@/src/assets/veiculo.png")}
						className="w-[260px] h-[140px]"
						resizeMode="contain"
					/>
				)}
			</View>

			<Text className="font-semibold text-base pl-2.5 mb-3" style={{ color: colors.text }}>
				Informações sobre a placa do veículo
			</Text>

			<View className="gap-4">
				<InputPlate control={control} name="plate" label="Placa" placeholder="ABC1D23" rules={rules.plate} />

				<InputDefault
					control={control}
					name="chassisNumber"
					label="Número do chassi (VIN)"
					placeholder="Ex: 9BWZZZ377VT004251"
					maxLength={17}
					rules={rules.chassisNumber}
				/>

				<InputDefault
					control={control}
					name="model"
					label="Modelo do caminhão"
					placeholder="Ex: FH16"
					rules={rules.model}
				/>

				<InputDefault
					control={control}
					name="mark"
					label="Marca do caminhão"
					placeholder="Ex: Mercedes-Benz"
					rules={rules.mark}
				/>

				<InputDefault
					control={control}
					name="country"
					label="País"
					placeholder="Brasil"
					rules={rules.country}
				/>

				<InputDefault
					control={control}
					name="state"
					label="Estado"
					placeholder="Estado"
					rules={rules.state}
				/>

				<InputDefault
					control={control}
					name="city"
					label="Município"
					placeholder="Município"
					rules={rules.city}
				/>
			</View>

			<View className="flex-1 justify-end pt-5">
				<ButtonDefault title="Confirmar" onPress={handleSubmit(handleRegisterVehicle)} />
			</View>
		</KeyboardAwareScrollView>
	);
};

export default VehicleData;
