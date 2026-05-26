import { useCallback, useState } from "react";
import {
	Modal,
	Pressable,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Image,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { DetailRow } from "@/src/components/info/DetailRow";
import { useGetVehicle } from "@/src/hooks/vehicle/useGetVehicle";
import { useDeleteVehicle } from "@/src/hooks/vehicle/useDeleteVehicle";
import { IconBox } from "@/src/components/ui/IconBox";
import animation from "@/src/utils/animation";
import type { RootStackParamList } from "@/src/routes/Routes";

function DetailVehicle() {
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();

	const route = useRoute<RouteProp<RootStackParamList, "DetailVehicle">>();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const vehicleParam = route.params?.vehicle;

	const { vehicleData, handleGetVehicle } = useGetVehicle();
	const { handleDeleteVehicle, isLoading: isDeleting } = useDeleteVehicle();

	const [isRefreshing, setIsRefreshing] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const vehicle = vehicleData ?? vehicleParam;

	useFocusEffect(
		useCallback(() => {
			handleGetVehicle(vehicleParam?.id ?? null);
		}, [handleGetVehicle, vehicleParam?.id])
	);

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		try {
			await handleGetVehicle(vehicle?.id ?? null);
		} finally {
			setIsRefreshing(false);
		}
	}, [handleGetVehicle, vehicle?.id]);

	const handleConfirmDelete = useCallback(async () => {
		setShowDeleteModal(false);
		if (!vehicle?.id) return;
		await handleDeleteVehicle(vehicle.id);
	}, [handleDeleteVehicle, vehicle?.id]);

	const formatCapacityWeight = (value?: number | null) => {
		if (value == null) return t("COMMON.EMPTY");
		return t("VEHICLE.DETAIL_CAPACITY_WEIGHT_VALUE", { weight: value });
	};

	const formatLength = (value?: number | null) => {
		if (value == null) return t("COMMON.EMPTY");
		return t("VEHICLE.DETAIL_LENGTH_VALUE", { length: value });
	};

	const formatAxes = (value?: number | null) => {
		if (value == null) return t("COMMON.EMPTY");
		return t("VEHICLE.DETAIL_AXES_VALUE", { axes: value });
	};

	const editVehicleTitle = [vehicle?.mark, vehicle?.model].filter(Boolean).join(" ") || t("ROUTES.DETAILVEHICLE");
	const editVehicleLocation = [vehicle?.city, vehicle?.stateUF].filter(Boolean).join(" - ") || t("COMMON.EMPTY");
	const editVehicleType = vehicle?.vehicleType?.nome || t("COMMON.EMPTY");
	const editVehiclePlate = vehicle?.plateNumber || t("COMMON.EMPTY");

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingBottom: 20 }} edges={["left", "right", "bottom"]}>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 20 }}
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
				{vehicle == null ? (
					<View className="flex-1 items-center justify-center mt-20">
						<Ionicons name="car-outline" size={48} color={iconColor} />
						<Text className="mt-4 text-base text-center" style={{ color: colors.textSecondary }}>
							{t("VEHICLE.DETAIL_NOVEHICLE")}
						</Text>
					</View>
				) : (
					<>
						<View className="flex-row justify-between items-center">
							<Text style={{ color: colors.text }} className="text-xl font-semibold flex-1 pr-3" numberOfLines={1}>
								{editVehicleTitle}
							</Text>
							<View className="p-2 rounded-xl flex-row items-center gap-2" style={{ backgroundColor: colors.bgQuinary }}>
								<Text className="text-base text-black font-semibold">{editVehiclePlate}</Text>
							</View>
						</View>
						<Text style={{ color: colors.textSecondary }} className="text-sm font-semibold">
							{editVehicleLocation}
						</Text>

						<View className="w-full justify-center items-center py-5">
							<Image
								source={require("@/src/assets/veiculo.png")}
								className="w-full h-32"
								resizeMode="contain"
							/>
						</View>

						<View className="flex-row gap-2.5 pb-5">
							<View className="flex-1 min-h-[52px] px-3 py-4 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1  }}>
								<Text style={{ color: colors.text }} className="text-sm font-semibold text-center" numberOfLines={2}>
									{t("VEHICLE.PLATE_LABEL")}: {editVehiclePlate}
								</Text>
							</View>
							<View className="flex-1 min-h-[52px] px-3 py-4 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1  }}>
								<Text style={{ color: colors.text }} className="text-sm font-semibold text-center" numberOfLines={2}>
									{t("VEHICLE.DETAIL_SECTION_TYPE")}: {editVehicleType}
								</Text>
							</View>
						</View>

						<View style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1  }} className="p-4 rounded-xl gap-2.5">
							<IconBox name="car-outline" />
							<View>
								<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
									{t("VEHICLE.MODEL_LABEL")}: {vehicle.model || t("COMMON.EMPTY")}
								</Text>
								<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
									{t("VEHICLE.MARK_LABEL")}: {vehicle.mark || t("COMMON.EMPTY")}
								</Text>
								<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
									{t("VEHICLE.CHASSIS_LABEL")}: {vehicle.chassisNumber || t("COMMON.EMPTY")}
								</Text>
							</View>
						</View>

						<View className="h-5" />

						<View style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1  }} className="p-4 rounded-xl gap-2.5">
							<IconBox name="location-outline" />
							<View>
								<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
									{t("VEHICLE.CITY_LABEL")}: {vehicle.city || t("COMMON.EMPTY")}
								</Text>
								<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
									{t("VEHICLE.STATE_LABEL")}: {vehicle.stateUF || t("COMMON.EMPTY")}
								</Text>
								<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
									{t("VEHICLE.COUNTRY_LABEL")}: {vehicle.country || t("COMMON.EMPTY")}
								</Text>
							</View>
						</View>

						<Text style={{ color: colors.text }} className="text-base font-semibold py-5">Mais detalhes</Text>
						<DetailRow
							label={t("VEHICLE.AXLE")}
							value={formatAxes(vehicle.vehicleType?.axes)}
						/>
						<DetailRow
							label={t("VEHICLE.GROSS_WEIGHT")}
							value={formatCapacityWeight(vehicle.vehicleType?.capacityWeight)}
						/>
						<DetailRow
							label={t("VEHICLE.LENGTH")}
							value={formatLength(vehicle.vehicleType?.length)}
						/>
					</>
				)}
			</ScrollView>

			{vehicle != null && (
				<View className="flex-row gap-2.5 w-full pt-3">
					<TouchableOpacity
						className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border"
						style={{
							backgroundColor: colors.bgSecondary,
							borderColor: colors.bgTertiary,
							borderWidth: 1,
						}}
						onPress={() => navigation.navigate("EditVehicle", { vehicle })}
						accessibilityRole="button"
						accessibilityLabel={t("VEHICLE.DETAIL_EDIT")}
					>
						<Ionicons name="pencil-outline" size={18} color={iconColor} />
						<Text className="font-semibold text-sm" style={{ color: colors.text }}>
							{t("VEHICLE.DETAIL_EDIT")}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl"
						style={{
							backgroundColor: "#ef4444",
							opacity: isDeleting ? 0.5 : 1,
						}}
						onPress={() => setShowDeleteModal(true)}
						disabled={isDeleting}
						accessibilityRole="button"
						accessibilityLabel={t("VEHICLE.DETAIL_DELETE")}
					>
						<Ionicons name="trash-outline" size={18} color="#ffffff" />
						<Text className="font-semibold text-sm text-white">
							{t("VEHICLE.DETAIL_DELETE")}
						</Text>
					</TouchableOpacity>
				</View>
			)}

			<Modal
				visible={showDeleteModal}
				transparent
				animationType="none"
				onRequestClose={() => setShowDeleteModal(false)}
			>
				<Pressable
					onPress={() => setShowDeleteModal(false)}
					style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
					className="items-center"
				>
					<animation.iPhoneBounceDown
						style={{
							marginTop: insets.top + 16,
							width: "90%",
							backgroundColor: colors.bg,
						}}
						className="rounded-xl p-4"
						onStartShouldSetResponder={() => true}
					>
						<Text className="text-base font-semibold text-center" style={{ color: colors.text }}>
							{t("VEHICLE.DETAIL_DELETE_CONFIRM_TITLE")}
						</Text>

						<Text className="text-sm text-center mt-2" style={{ color: colors.textSecondary }}>
							{t("VEHICLE.DETAIL_DELETE_CONFIRM_MESSAGE")}
						</Text>

						<View className="mt-4 flex-row gap-3">
							<TouchableOpacity
								className="flex-1 py-2.5 rounded-lg items-center"
								style={{ backgroundColor: colors.bgTertiary }}
								onPress={() => setShowDeleteModal(false)}
							>
								<Text className="font-semibold" style={{ color: colors.text }}>
									{t("COMMON.CANCEL")}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								className="flex-1 py-2.5 rounded-lg items-center bg-red-500"
								onPress={handleConfirmDelete}
							>
								<Text className="font-semibold text-white">
									{t("COMMON.CONFIRM")}
								</Text>
							</TouchableOpacity>
						</View>
					</animation.iPhoneBounceDown>
				</Pressable>
			</Modal>
		</SafeAreaView>
	);
}

export default DetailVehicle;
