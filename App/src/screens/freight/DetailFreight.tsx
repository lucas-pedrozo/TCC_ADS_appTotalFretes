import { useCallback, useMemo } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useFocusEffect, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "@/src/routes/Routes";
import { useThemeColors } from "@/src/context/ThemeContext";
import { maskMoney } from "@/src/utils/formMask";
import { extractCityFromAddressLabel } from "@/src/utils/format";
import { IconBox } from "@/src/components/ui/IconBox";
import { DetailRow } from "@/src/components/info/DetailRow";
import { ButtonDefault, ButtonApproved } from "@/src/components/form/buttons/ButtonDefault";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetUser } from "@/src/hooks/user/useGetUser";

type DetailFreightRouteProp = RouteProp<RootStackParamList, "DetailFreight">;

const DetailFreight = () => {
	const route = useRoute<DetailFreightRouteProp>();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const colors = useThemeColors();
	const { t } = useTranslation();
	const freight = route.params.freight;

	const { userData, handleGetUser } = useGetUser();

	useFocusEffect(
		useCallback(() => {
			void handleGetUser();
		}, [handleGetUser]),
	);

	const hasVehicle = userData?.vehicle_id != null;

	const freightValue = freight.finalValue ?? freight.originalValue;
	const valueText = freightValue != null ? `R$ ${maskMoney(freightValue)}` : t("CARD.ACTIVITY.N_A");
	const weightText =
		freight.weight != null
			? `${Number(freight.weight).toLocaleString("pt-BR")} kg`
			: t("CARD.ACTIVITY.N_A");

	const goToRegisterVehicle = useCallback(() => {
		navigation.navigate("VehicleGroup");
	}, [navigation]);

	const originCity = useMemo(
		() => extractCityFromAddressLabel(freight.origin_label, t("CARD.ACTIVITY.N_A")),
		[freight.origin_label, t]
	);

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingBottom: 20, paddingTop: 16 }}
			edges={["left", "right", "bottom"]}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className="flex-row justify-between items-center">
					<Text style={{ color: colors.text }} className="text-xl font-semibold">
						{freight.name}
					</Text>
					<View
						className="p-2 rounded-xl flex-row items-center gap-2"
						style={{ backgroundColor: colors.bgQuinary }}
					>
						<Text className="text-base text-black font-semibold">{freight.cargo?.name}</Text>
						<Text className="text-base text-black/60 font-semibold">/ {freight.weight} kg</Text>
					</View>
				</View>
				<Text style={{ color: colors.textSecondary }} className="text-sm font-semibold">
					{originCity}
				</Text>

				<View className="w-full justify-center items-center py-5">
					<Image source={require("@/src/assets/carga.png")} resizeMode="contain" />
				</View>

				<View className="flex-row gap-2.5 pb-5">
					<View
						className="flex-1 min-h-[52px] px-3 py-4 rounded-xl items-center justify-center"
						style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1 }}
					>
						<Text
							style={{ color: colors.text }}
							className="text-sm font-semibold text-center"
							numberOfLines={2}
						>
							{t("PROPOSAL.FREIGHT_VALUE")}: {valueText}
						</Text>
					</View>
					<View
						className="flex-1 min-h-[52px] px-3 py-4 rounded-xl items-center justify-center"
						style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1 }}
					>
						<Text
							style={{ color: colors.text }}
							className="text-sm font-semibold text-center"
							numberOfLines={2}
						>
							{t("CARD.VEHICLE.WEIGHT")}: {weightText}
						</Text>
					</View>
				</View>

				<View
					style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1 }}
					className="p-4 rounded-xl gap-2.5"
				>
					<IconBox name="cube-outline" />
					<View>
						<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
							{t("FREIGHT.ORIGIN")}: {freight.origin_label}
						</Text>
						<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
							{t("FREIGHT.DESTINATION")}: {freight.destination_label}
						</Text>
						<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
							{t("FREIGHT.DEADLINE")}: {freight.daysLimit ?? t("CARD.ACTIVITY.N_A")}
						</Text>
					</View>
				</View>

				<View className="h-5" />

				<View
					style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1 }}
					className="p-4 rounded-xl gap-2.5"
				>
					<IconBox name="business-outline" />
					<View>
						<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
							{t("FREIGHT.COMPANY")}: {freight.Company?.name?.trim() || t("COMMON.EMPTY")}
						</Text>
						<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
							{t("FREIGHT.COMPANY_CITY")}: {freight.Company?.city?.trim() || t("COMMON.EMPTY")}
						</Text>
					</View>
				</View>

				<Text style={{ color: colors.text }} className="text-base font-semibold py-5">
					{t("FREIGHT.MORE_DETAILS")}
				</Text>
				<DetailRow label={t("FREIGHT.TYPE")} value={freight.cargo?.name ?? t("CARD.ACTIVITY.N_A")} />
				<DetailRow
					label={t("FREIGHT.WEIGHT")}
					value={
						freight.weight != null
							? t("FREIGHT.WEIGHT_VALUE", { weight: Number(freight.weight).toLocaleString("pt-BR") })
							: t("CARD.ACTIVITY.N_A")
					}
				/>
				<DetailRow
					label={t("FREIGHT.DEADLINE")}
					value={
						freight.daysLimit != null
							? t("FREIGHT.DEADLINE_VALUE", { days: freight.daysLimit })
							: t("CARD.ACTIVITY.N_A")
					}
				/>
				<DetailRow label={t("FREIGHT.ORIGIN")} value={freight.origin_label} />
				<DetailRow label={t("FREIGHT.DESTINATION")} value={freight.destination_label} />
			</ScrollView>

			{!hasVehicle && userData != null && (
				<View
					className="w-full justify-center items-center my-2.5 p-2 rounded-xl"
					style={{ backgroundColor: colors.bgSecondary }}
				>
					<Text className="text-sm font-semibold text-center" style={{ color: colors.textSenary }}>
						{t("FREIGHT.VALIDATION.NO_VEHICLE")}
					</Text>
				</View>
			)}
			{!hasVehicle && userData != null ? (
				<ButtonDefault onPress={goToRegisterVehicle} title={t("FREIGHT.NEXT")} />
			) : (
				<ButtonApproved
					onPress={() => navigation.navigate("SendProposal", { freight })}
					title={t("FREIGHT.NEXT")}
				/>
			)}
		</SafeAreaView>
	);
};

export default DetailFreight;
