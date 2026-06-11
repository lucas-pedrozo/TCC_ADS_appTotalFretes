import { Image, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { ButtonCancel, ButtonDefault, InputDefault, InputPlate } from "@/src/components/form";
import { IconBox } from "@/src/components/ui/IconBox";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useEditVehicle } from "@/src/hooks/vehicle/useEditVehicle";
import { getVehicleTypeImage } from "@/src/utils/vehicleTypeImages";
import type { RootStackParamList } from "@/src/routes/Routes";

type EditVehicleRouteProp = RouteProp<RootStackParamList, "EditVehicle">;

function EditVehicle() {
	const colors = useThemeColors();
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();
	const route = useRoute<EditVehicleRouteProp>();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const vehicle = route.params.vehicle;

	const { control, handleSubmit, handleEditVehicle, rules } = useEditVehicle({
		vehicleId: vehicle.id,
		defaultValues: {
			plate: vehicle.plateNumber ?? "",
			chassisNumber: vehicle.chassisNumber ?? "",
			model: vehicle.model ?? "",
			mark: vehicle.mark ?? "",
			country: vehicle.country ?? "",
			state: vehicle.stateUF ?? "",
			city: vehicle.city ?? "",
		},
	});

	const vehicleTitle = [vehicle.mark, vehicle.model].filter(Boolean).join(" ") || t("ROUTES.EDITVEHICLE");
	const vehicleLocation = [vehicle.city, vehicle.stateUF].filter(Boolean).join(" - ") || t("COMMON.EMPTY");
	const vehicleType = vehicle.vehicleType?.nome || t("COMMON.EMPTY");
	const vehiclePlate = vehicle.plateNumber || t("COMMON.EMPTY");

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingBottom: 20 }} edges={["left", "right", "bottom"]}>
			<KeyboardAwareScrollView
				contentContainerStyle={{
					flexGrow: 1,
					paddingBottom: insets.bottom + 24,
				}}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<View className="flex-row justify-between items-center">
					<Text style={{ color: colors.text }} className="text-xl font-semibold flex-1 pr-3" numberOfLines={1}>
						{vehicleTitle}
					</Text>
					<View className="p-2 rounded-xl flex-row items-center gap-2" style={{ backgroundColor: colors.bgQuinary }}>
						<Text className="text-base text-black font-semibold">{vehiclePlate}</Text>
					</View>
				</View>
				<Text style={{ color: colors.textSecondary }} className="text-sm font-semibold">
					{vehicleLocation}
				</Text>

				<View className="w-full justify-center items-center py-5">
					<Image
						source={getVehicleTypeImage(vehicle.vehicleType?.nome ?? "")}
						className="w-full h-32"
						resizeMode="contain"
					/>
				</View>

				<View className="flex-row gap-2.5 pb-5">
					<View className="flex-1 min-h-[52px] px-3 py-4 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1  }}>
						<Text style={{ color: colors.text }} className="text-sm font-semibold text-center" numberOfLines={2}>
							{t("VEHICLE.PLATE_LABEL")}: {vehiclePlate}
						</Text>
					</View>
					<View className="flex-1 min-h-[52px] px-3 py-4 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1  }}>
						<Text style={{ color: colors.text }} className="text-sm font-semibold text-center" numberOfLines={2}>
							{t("VEHICLE.DETAIL_SECTION_TYPE")}: {vehicleType}
						</Text>
					</View>
				</View>

				<View style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1  }} className="p-4 rounded-xl gap-4">
					<IconBox name="car-outline" />
					<Text className="font-semibold text-base" style={{ color: colors.text }}>
						{t("VEHICLE.DETAIL_SECTION_IDENTIFICATION")}
					</Text>

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
				</View>

				<View className="h-5" />

				<View style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1  }} className="p-4 rounded-xl gap-4">
					<IconBox name="location-outline" />
					<Text className="font-semibold text-base" style={{ color: colors.text }}>
						{t("VEHICLE.DETAIL_SECTION_LOCATION")}
					</Text>

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
			</KeyboardAwareScrollView>

			<View className="flex-row gap-2.5 w-full pt-3">
				<ButtonCancel
					title={t("COMMON.CANCEL")}
					onPress={() => navigation.goBack()}
					size="small"
				/>
				<ButtonDefault
					title={t("COMMON.CONFIRM")}
					onPress={handleSubmit(handleEditVehicle)}
					size="small"
				/>
			</View>
		</SafeAreaView>
	);
}

export default EditVehicle;
