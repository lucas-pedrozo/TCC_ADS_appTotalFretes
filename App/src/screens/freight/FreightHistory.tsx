import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { CardFreight } from "@/src/components/cards/CardFreight";
import { ButtonFilter, InputSearch } from "@/src/components/form";
import ModalFreightHistoryFilter from "@/src/components/modal/ModalFreightHistoryFilter";
import { useIconColor, useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { useGetFreightHistory } from "@/src/hooks/freight/useGetFreightHistory";
import type { RootStackParamList } from "@/src/routes/Routes";
import {
	DEFAULT_FREIGHT_HISTORY_STATUS_FILTER,
	type FreightHistoryStatusFilter,
} from "@/src/types/freightHistoryFilter";

const FreightHistory = () => {
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { mode } = useThemeMode();
	const { t } = useTranslation();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [statusFilter, setStatusFilter] = useState<FreightHistoryStatusFilter>(
		DEFAULT_FREIGHT_HISTORY_STATUS_FILTER,
	);
	const { control, watch } = useForm<{ search: string }>({ defaultValues: { search: "" } });
	const searchQuery = watch("search");
	const { items, isLoading, isLoadingMore, hasMore, handleGetFreightHistory, loadMore } =
		useGetFreightHistory(statusFilter);

	const displayedItems = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return items;

		return items.filter((freight) => {
			const haystack = [
				freight.name,
				freight.origin_label,
				freight.destination_label,
				freight.cargo?.name,
				freight.status?.name,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			return haystack.includes(query);
		});
	}, [items, searchQuery]);

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		try {
			await handleGetFreightHistory();
		} finally {
			setIsRefreshing(false);
		}
	}, [handleGetFreightHistory]);

	const handleOpenFilter = useCallback(() => {
		setShowFilterModal(true);
	}, []);

	const handleCloseFilter = useCallback(() => {
		setShowFilterModal(false);
	}, []);

	const handleApplyFilter = useCallback((next: FreightHistoryStatusFilter) => {
		setStatusFilter(next);
		setShowFilterModal(false);
	}, []);

	useFocusEffect(
		useCallback(() => {
			void handleGetFreightHistory();
		}, [handleGetFreightHistory]),
	);

	return (
		<SafeAreaView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: colors.bg}} edges={["left", "right"]}>

			<View className="flex-row items-center gap-2.5 justify-between mb-2">
				<InputSearch control={control} name="search" placeholder={t("FREIGHTHISTORY.SEARCH_PLACEHOLDER")} />
				<ButtonFilter onPress={handleOpenFilter} />
			</View>

			{statusFilter !== DEFAULT_FREIGHT_HISTORY_STATUS_FILTER ? (
				<Text className="text-xs mb-2" style={{ color: colors.textSecondary }}>
					{t("MODALFREIGHTHISTORYFILTER.ACTIVE_FILTER", {
						status: t(`MODALFREIGHTHISTORYFILTER.STATUS_${statusFilter.toUpperCase()}`),
					})}
				</Text>
			) : null}

			{isLoading && items.length === 0 ? (
				<View className="flex-1 items-center justify-center py-24">
					<ActivityIndicator size="large" color={iconColor} />
				</View>
			) : (
				<FlatList
					data={displayedItems}
					keyExtractor={(item) => String(item.id)}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
					contentContainerStyle={{ paddingBottom: 40, paddingTop: 20, flexGrow: 1 }}
					renderItem={({ item }) => (
						<CardFreight
							freight={item}
							navigateTo={() => navigation.navigate("DetailFreight", { freight: item })}
						/>
					)}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							tintColor={mode === "dark" ? "#FFFFFF" : "#000000"}
						/>
					}
					onEndReached={() => {
						if (searchQuery.trim()) return;
						void loadMore();
					}}
					onEndReachedThreshold={0.3}
					ListFooterComponent={
						isLoadingMore ? (
							<View className="py-4 items-center">
								<ActivityIndicator size="small" color={iconColor} />
							</View>
						) : null
					}
					ListEmptyComponent={
						<Text className="text-center mt-10 text-base" style={{ color: colors.textSecondary }}>
							{t("FREIGHTHISTORY.EMPTY_LIST")}
						</Text>
					}
				/>
			)}

			<ModalFreightHistoryFilter
				visible={showFilterModal}
				onClose={handleCloseFilter}
				onApply={handleApplyFilter}
				appliedFilter={statusFilter}
			/>
		</SafeAreaView>
	);
};

export default FreightHistory;
