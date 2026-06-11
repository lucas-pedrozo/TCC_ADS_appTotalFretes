import { Image, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/context/ThemeContext";
import { InputDefault, InputPlate, ButtonDefault } from "@/src/components/form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useRegisterVehicle } from "@/src/hooks/vehicle/useRegisterVehicle";
import { useRegisterVehicleContext } from "@/src/context/RegisterVehicleContext";
import { getVehicleTypeImage } from "@/src/utils/vehicleTypeImages";


const VehicleData = () => {
	const colors = useThemeColors();
	const { t } = useTranslation();
	const { control, handleSubmit, handleRegisterVehicle, rules } = useRegisterVehicle();
	const { vehicleType } = useRegisterVehicleContext();

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
		>
			<Text className="pl-2.5 pb-4" style={{ color: colors.text }}>{t("VEHICLE.DATA_INTRO")}</Text>

			<View className="items-center mb-4">
				<Image
					source={getVehicleTypeImage(vehicleType?.name ?? "")}
					className="w-[260px] h-[140px]"
					resizeMode="contain"
				/>
			</View>

			<Text className="font-semibold text-base pl-2.5 mb-3" style={{ color: colors.text }}>
				{t("VEHICLE.PLATE_SECTION")}
			</Text>

			<View className="gap-4">
				<InputPlate
					control={control}
					name="plate"
					label={t("VEHICLE.PLATE_LABEL")}
					placeholder={t("VEHICLE.PLATE_PLACEHOLDER")}
					rules={rules.plate}
				/>

				<InputDefault
					control={control}
					name="chassisNumber"
					label={t("VEHICLE.CHASSIS_LABEL")}
					placeholder={t("VEHICLE.CHASSIS_PLACEHOLDER")}
					maxLength={17}
					rules={rules.chassisNumber}
				/>

				<InputDefault
					control={control}
					name="model"
					label={t("VEHICLE.MODEL_LABEL")}
					placeholder={t("VEHICLE.MODEL_PLACEHOLDER")}
					rules={rules.model}
				/>

				<InputDefault
					control={control}
					name="mark"
					label={t("VEHICLE.MARK_LABEL")}
					placeholder={t("VEHICLE.MARK_PLACEHOLDER")}
					rules={rules.mark}
				/>

				<InputDefault
					control={control}
					name="country"
					label={t("VEHICLE.COUNTRY_LABEL")}
					placeholder={t("VEHICLE.COUNTRY_PLACEHOLDER")}
					rules={rules.country}
				/>

				<InputDefault
					control={control}
					name="state"
					label={t("VEHICLE.STATE_LABEL")}
					placeholder={t("VEHICLE.STATE_PLACEHOLDER")}
					rules={rules.state}
				/>

				<InputDefault
					control={control}
					name="city"
					label={t("VEHICLE.CITY_LABEL")}
					placeholder={t("VEHICLE.CITY_PLACEHOLDER")}
					rules={rules.city}
				/>
			</View>

			<View className="flex-1 justify-end pt-5">
				<ButtonDefault title={t("COMMON.CONFIRM")} onPress={handleSubmit(handleRegisterVehicle)} />
			</View>
		</KeyboardAwareScrollView>
	);
};

export default VehicleData;
