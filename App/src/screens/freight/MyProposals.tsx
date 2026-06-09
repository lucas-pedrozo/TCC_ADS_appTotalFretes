import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { CardFreight } from "@/src/components/cards/CardFreight";
import { ButtonFilter, InputSearch } from "@/src/components/form";
import ModalProposalFilter from "@/src/components/modal/ModalProposalFilter";
import { useIconColor, useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { getProposalFreight, useGetProposals } from "@/src/hooks/proposal/useGetProposals";
import type { RootStackParamList } from "@/src/routes/Routes";
import {
	DEFAULT_PROPOSAL_STATUS_FILTER,
	type ProposalStatusFilter,
} from "@/src/types/proposalFilter";

const MyProposals = () => {
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { mode } = useThemeMode();
	const { t } = useTranslation();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [statusFilter, setStatusFilter] = useState<ProposalStatusFilter>(
		DEFAULT_PROPOSAL_STATUS_FILTER,
	);
	const { control, watch } = useForm<{ search: string }>({ defaultValues: { search: "" } });
	const searchQuery = watch("search");
	const { proposals, isLoading, handleGetProposals } = useGetProposals(statusFilter);

	const displayedProposals = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return proposals;

		return proposals.filter((proposal) => {
			const freight = getProposalFreight(proposal);
			const haystack = [
				freight?.name,
				freight?.origin_label,
				freight?.destination_label,
				freight?.cargo?.name,
				proposal.ProposalStatusType?.name,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			return haystack.includes(query);
		});
	}, [proposals, searchQuery]);

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		try {
			await handleGetProposals();
		} finally {
			setIsRefreshing(false);
		}
	}, [handleGetProposals]);

	const handleOpenFilter = useCallback(() => {
		setShowFilterModal(true);
	}, []);

	const handleCloseFilter = useCallback(() => {
		setShowFilterModal(false);
	}, []);

	const handleApplyFilter = useCallback((next: ProposalStatusFilter) => {
		setStatusFilter(next);
		setShowFilterModal(false);
	}, []);

	useFocusEffect(
		useCallback(() => {
			void handleGetProposals();
		}, [handleGetProposals]),
	);

	return (
		<SafeAreaView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: colors.bg, paddingTop: 10 }}>
			<Text className="text-2xl text-center font-semibold" style={{ color: colors.text }}>
				{t("PROPOSAL.MY_PROPOSALS")}
			</Text>

			<View className="h-7" />

			<View className="flex-row items-center gap-2.5 justify-between mb-2">
				<InputSearch control={control} name="search" placeholder={t("PROPOSAL.SEARCH_PLACEHOLDER")} />
				<ButtonFilter onPress={handleOpenFilter} />
			</View>

			{statusFilter !== DEFAULT_PROPOSAL_STATUS_FILTER ? (
				<Text className="text-xs mb-2" style={{ color: colors.textSecondary }}>
					{t("MODALPROPOSALFILTER.ACTIVE_FILTER", {
						status: t(`MODALPROPOSALFILTER.STATUS_${statusFilter.toUpperCase()}`),
					})}
				</Text>
			) : null}

			{isLoading && proposals.length === 0 ? (
				<View className="flex-1 items-center justify-center py-24">
					<ActivityIndicator size="large" color={iconColor} />
				</View>
			) : (
				<FlatList
					data={displayedProposals}
					keyExtractor={(item) => String(item.id)}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
					contentContainerStyle={{ paddingBottom: 120, paddingTop: 20, flexGrow: 1 }}
					renderItem={({ item }) => (
						<CardFreight
							freight={getProposalFreight(item)}
							navigateTo={() => navigation.navigate("ProposalDetail", { proposalId: item.id })}
						/>
					)}
					refreshControl={
						<RefreshControl
							refreshing={isRefreshing}
							onRefresh={handleRefresh}
							tintColor={mode === "dark" ? "#FFFFFF" : "#000000"}
						/>
					}
					ListEmptyComponent={
						<Text className="text-center mt-10 text-base" style={{ color: colors.textSecondary }}>
							{t("PROPOSAL.EMPTY_LIST")}
						</Text>
					}
				/>
			)}

			<ModalProposalFilter
				visible={showFilterModal}
				onClose={handleCloseFilter}
				onApply={handleApplyFilter}
				appliedFilter={statusFilter}
			/>
		</SafeAreaView>
	);
};

export default MyProposals;
