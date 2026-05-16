import { useCallback, useEffect, useState } from "react";
import { Linking, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useCancelFreight } from "@/src/hooks/freight/useCancelFreight";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";
import { Ionicons } from "@expo/vector-icons";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { DetailRow } from "@/src/components/info/DetailRow";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardFreight } from "@/src/components/cards/CardFreight";
import { CardActivityHome } from "@/src/components/cards/CardActivityHome";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "@/src/routes/RoutesTabs";
import { getCurrentCoordinates, type Coordinates } from "@/src/services/location";
import { buildGoogleMapsDirectionsUrl, isUsableGps } from "@/src/utils/googleMapsDirections";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { maskDate } from "@/src/utils/formMask";
import { ButtonCancel, ButtonDefault } from "@/src/components/form";


function OngoingFreights() {
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const [refreshKey, setRefreshKey] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { t } = useTranslation();
	const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
	const { notify } = useAlertDefault();

	const { freightUser, handleGetFreightUser } = useGetFreightUser();
	const { handleCancelFreight, isLoading: isCancelling } = useCancelFreight();

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		try {
			await Promise.all([handleGetFreightUser()]);
			setRefreshKey((prev) => prev + 1);
		} finally {
			setIsRefreshing(false);
		}
	}, [handleGetFreightUser]);

	useEffect(() => {
		handleGetFreightUser();
	}, [handleGetFreightUser]);

	const destinationLabel = freightUser?.destination_label?.trim() ?? "";
	const stopLabel = freightUser?.origin_label?.trim() ?? "";
	const canOpenGoogle = Boolean(destinationLabel);

	const goToMapScreen = useCallback(() => {
		navigation.navigate("MapScreen" as never);
	}, [navigation]);

	const handleCancel = useCallback(async () => {
		if (!freightUser?.id) return;

		await handleCancelFreight(freightUser.id);
		await handleGetFreightUser();
		setRefreshKey((prev) => prev + 1);
	}, [freightUser?.id, handleCancelFreight, handleGetFreightUser]);

	const openGoogleMaps = useCallback(async () => {
		if (!destinationLabel) return;

		let origin: Coordinates | null = null;
		try {
			const pos = await getCurrentCoordinates();
			if (pos && isUsableGps(pos)) origin = pos;
		} catch {
			/* Google Maps usa posição atual se não houver origem */
		}

		const url = buildGoogleMapsDirectionsUrl({
			origin,
			waypointLabel: stopLabel,
			destinationLabel,
		});

		try {
			await Linking.openURL(url);
		} catch {
			await notify({
				status: "error",
				message: t("FREIGHT.OPENGOOGLEMAPS_ERROR"),
			});
		}
	}, [destinationLabel, notify, stopLabel, t]);

	const btnBase =
		"flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg border";
	const btnSecondary = { backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1 };

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
			<ScrollView
				contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 10 }}
				showsVerticalScrollIndicator={false}
				className="flex-1"
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={handleRefresh}
						tintColor={iconColor}
					/>
				}
			>
				<Text className="text-2xl text-center font-semibold" style={{ color: colors.text }}>
					{t("FREIGHT.ONGOING_TITLE")}
				</Text>
				<View className="h-7" />

				<CardFreight freight={freightUser} />

				<View className="h-7" />

				<CardActivityHome
					key={`card-activity-${refreshKey}`}
					freight={freightUser}
					AcceptButton={false}
				/>

				<View className="h-7" />

				<View className="flex-row gap-2 w-full">
					<TouchableOpacity
						className={btnBase}
						style={[btnSecondary, { opacity: canOpenGoogle ? 1 : 0.45 }]}
						disabled={!canOpenGoogle}
						onPress={openGoogleMaps}
						accessibilityRole="button"
						accessibilityLabel={t("FREIGHT.OPENGOOGLEMAPS_A11Y")}
					>
						<Ionicons name="logo-google" size={20} color={iconColor} />
						<Text className="font-semibold text-sm text-center" style={{ color: colors.text }} numberOfLines={2}>
							{t("FREIGHT.OPENGOOGLEMAPS")}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className={btnBase}
						style={btnSecondary}
						onPress={goToMapScreen}
						accessibilityRole="button"
						accessibilityLabel={t("FREIGHT.OPEN_APP_MAP")}
					>
						<Ionicons name="map" size={20} color={iconColor} />
						<Text className="font-semibold text-sm text-center" style={{ color: colors.text }} numberOfLines={2}>
							{t("FREIGHT.OPEN_APP_MAP")}
						</Text>
					</TouchableOpacity>
				</View>

				<Text className="font-semibold text-base pl-2.5 mb-4 mt-5" style={{ color: colors.text }}>
					{t("FREIGHT.MORE_DETAILS")}
				</Text>
				<DetailRow label={t("FREIGHT.TYPE")} value={freightUser?.cargo?.name ?? t("COMMON.EMPTY")} />
				<DetailRow
					label={t("FREIGHT.WEIGHT")}
					value={t("FREIGHT.WEIGHT_VALUE", { weight: freightUser?.weight ?? t("COMMON.EMPTY") })}
				/>
				<DetailRow
					label={t("FREIGHT.DEADLINE")}
					value={t("FREIGHT.DEADLINE_VALUE", { days: freightUser?.daysLimit ?? t("COMMON.EMPTY") })}
				/>
				<DetailRow label={t("FREIGHT.ORIGIN")} value={freightUser?.origin_label ?? t("COMMON.EMPTY")} />
				<DetailRow label={t("FREIGHT.DESTINATION")} value={freightUser?.destination_label ?? t("COMMON.EMPTY")} />
				{freightUser?.id != null ? (
					<View className="flex-row gap-2.5 w-full mt-5 justify-between">
						<ButtonCancel
							title={t("COMMON.CANCEL")}
							onPress={handleCancel}
							size="small"
							disabled={isCancelling}
						/>
						<ButtonDefault title={t("COMMON.CONFIRM")} onPress={() => { }} size="small" />
					</View>
				) : null}
			</ScrollView>
		</SafeAreaView>
	);
}

export default OngoingFreights;
