import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useIconColor, useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { CardFreight } from "@/src/components/cards/CardFreight";
import { InputSearch, ButtonFilter } from "@/src/components/form";
import ModalFilter from "@/src/components/modal/ModalFilter";
import { useGetAllFreigth } from "@/src/hooks/freight/useGetAllFreigth";
import { useGetUser } from "@/src/hooks/user/useGetUser";
import { getCurrentCoordinates } from "@/src/services/location";
import { isUsableGps } from "@/src/utils/googleMapsDirections";
import { filterAndSortFreights } from "@/src/utils/freightListQuery";
import { DEFAULT_FREIGHT_FILTER_STATE, type FreightFilterState } from "@/src/types/freightFilter";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";

const Freight = () => {
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const { t } = useTranslation();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { mode } = useThemeMode();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [filters, setFilters] = useState<FreightFilterState>(DEFAULT_FREIGHT_FILTER_STATE);
	const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
	const [regionLabel, setRegionLabel] = useState<string | null>(null);

	const { control, watch } = useForm<{ search: string }>({ defaultValues: { search: "" } });
	const searchQuery = watch("search");

	const { allFreigth, handleGetAllFreigth, loadMore, isLoading, isLoadingMore } = useGetAllFreigth();
	const { userData, handleGetUser } = useGetUser();

	const handleEndReached = useCallback(() => {
		void loadMore();
	}, [loadMore]);

	const listFooter = useMemo(
		() =>
			isLoadingMore ? (
				<View className="py-4 items-center">
					<ActivityIndicator size="small" color={iconColor} />
				</View>
			) : null,
		[isLoadingMore, iconColor],
	);

	const displayedFreights = useMemo(
		() => filterAndSortFreights(allFreigth, searchQuery, filters, userCoords, userData?.cnhType_id ?? null),
		[allFreigth, searchQuery, filters, userCoords, userData?.cnhType_id],
	);

	const regionDisplay =
		regionLabel === null ? t("MODALFILTER.CITY_LOADING") : regionLabel || t("MODALFILTER.CITY_UNKNOWN");

	useEffect(() => {
		let cancelled = false;
		(async () => {
			const c = await getCurrentCoordinates();
			if (cancelled) return;
			if (!c || !isUsableGps(c)) {
				setUserCoords(null);
				setRegionLabel("");
				return;
			}
			setUserCoords({ latitude: c.latitude, longitude: c.longitude });
			try {
				const places = await Location.reverseGeocodeAsync({
					latitude: c.latitude,
					longitude: c.longitude,
				});
				if (cancelled) return;
				const p = places[0];
				if (!p) {
					setRegionLabel("");
					return;
				}
				const parts = [p.city ?? p.subregion, p.region].filter(Boolean) as string[];
				setRegionLabel(parts.length ? parts.join(" — ") : p.formattedAddress ?? "");
			} catch {
				if (!cancelled) setRegionLabel("");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		try {
			await handleGetAllFreigth();
			const c = await getCurrentCoordinates();
			if (c && isUsableGps(c)) {
				setUserCoords({ latitude: c.latitude, longitude: c.longitude });
				try {
					const places = await Location.reverseGeocodeAsync({
						latitude: c.latitude,
						longitude: c.longitude,
					});
					const p = places[0];
					if (p) {
						const parts = [p.city ?? p.subregion, p.region].filter(Boolean) as string[];
						setRegionLabel(parts.length ? parts.join(" — ") : p.formattedAddress ?? "");
					}
				} catch {
					setRegionLabel("");
				}
			}
		} finally {
			setIsRefreshing(false);
		}
	}, [handleGetAllFreigth]);

	const handleOpenFilter = useCallback(() => {
		setShowFilterModal(true);
	}, []);

	const handleCloseFilter = useCallback(() => {
		setShowFilterModal(false);
	}, []);

	const handleApplyFilter = useCallback((next: FreightFilterState) => {
		setFilters(next);
		setShowFilterModal(false);
	}, []);

	useEffect(() => {
		void handleGetAllFreigth();
		void handleGetUser();
	}, [handleGetAllFreigth, handleGetUser]);

	return (
		<SafeAreaView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: colors.bg, paddingTop: 10 }}>
			<Text className="text-2xl text-center font-semibold" style={{ color: colors.text }}>
				{t("FREIGHT.TITLE")}
			</Text>

			<View className="h-7" />

			<View className="flex-row items-center gap-2.5 justify-between mb-2">
				<InputSearch control={control} name="search" placeholder={t("FREIGHT.SEARCHPLACEHOLDER")} />
				<ButtonFilter onPress={handleOpenFilter} />
			</View>

			{isLoading && allFreigth.length === 0 ? (
				<View className="flex-1 items-center justify-center py-24">
					<ActivityIndicator size="large" color={iconColor} />
				</View>
			) : (
				<FlatList
					data={displayedFreights}
					keyExtractor={(item) => String(item.id)}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
					contentContainerStyle={{ paddingBottom: 120, paddingTop: 20, flexGrow: 1 }}
					renderItem={({ item }) => (
						<CardFreight
							freight={item}
							navigateTo={() => navigation.navigate("DetailFreight", { freight: item })}
						/>
					)}
					onEndReached={handleEndReached}
					onEndReachedThreshold={0.3}
					ListFooterComponent={listFooter}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							tintColor={mode === "dark" ? "#FFFFFF" : "#000000"}
						/>
					}
					ListEmptyComponent={
						<Text className="text-center mt-10 text-base" style={{ color: colors.textSecondary }}>
							{t("FREIGHT.EMPTYLIST")}
						</Text>
					}
				/>
			)}

			<ModalFilter
				visible={showFilterModal}
				onClose={handleCloseFilter}
				onApply={handleApplyFilter}
				currentCity={regionDisplay}
				appliedFilters={filters}
			/>
		</SafeAreaView>
	);
};

export default Freight;
