import { useCallback, useEffect, useMemo } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { ButtonApproved, ButtonCancel } from "@/src/components/form/buttons/ButtonDefault";
import { DetailRow } from "@/src/components/info/DetailRow";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { getProposalFreight } from "@/src/hooks/proposal/useGetProposals";
import { useConfirmProposal } from "@/src/hooks/proposal/useConfirmProposal";
import { useProposalDetail } from "@/src/hooks/proposal/useProposalDetail";
import type { RootStackParamList } from "@/src/routes/Routes";
import { maskMoney } from "@/src/utils/formMask";

type ProposalDetailRouteProp = RouteProp<RootStackParamList, "ProposalDetail">;

const formatMoneyLabel = (value?: number | null) => {
	if (value == null || !Number.isFinite(Number(value))) return "---";
	return `R$ ${maskMoney(value)}`;
};

const formatDateLabel = (value?: string) => {
	if (!value) return "---";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "---";
	return date.toLocaleDateString("pt-BR");
};

const normalizeStatus = (value: string | null | undefined) =>
	(value ?? "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.toLowerCase();

const ProposalDetail = () => {
	const route = useRoute<ProposalDetailRouteProp>();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const { t } = useTranslation();
	const { proposal, isLoading, isCancelling, handleGetProposal, handleCancelProposal } =
		useProposalDetail();
	const { handleConfirmProposal, handleDeclineProposal, isLoading: isConfirming } =
		useConfirmProposal();

	const proposalId = route.params.proposalId;
	const freight = proposal ? getProposalFreight(proposal) : null;
	const freightValue = freight?.finalValue ?? freight?.originalValue;
	const statusName = proposal?.ProposalStatusType?.name ?? t("PROPOSAL.STATUS_UNKNOWN");
	const statusKey = normalizeStatus(statusName);

	const isAwaitingDriver = statusKey === "esperando caminhoneiro";
	const isSent = statusKey === "enviada";
	const isAccepted = statusKey.includes("aceit") || statusKey === "accepted";

	const statusStyle = useMemo(() => {
		if (isAccepted) {
			return { backgroundColor: "#D1F9E2", color: "#166534" };
		}
		if (isAwaitingDriver) {
			return { backgroundColor: "#FEF3C7", color: "#92400E" };
		}
		if (statusKey.includes("recus") || statusKey.includes("selecionada")) {
			return { backgroundColor: "#FEE2E2", color: "#B91C1C" };
		}
		return { backgroundColor: "#E0E7FF", color: "#3730A3" };
	}, [isAccepted, isAwaitingDriver, statusKey]);

	useEffect(() => {
		void handleGetProposal(proposalId);
	}, [handleGetProposal, proposalId]);

	const handleConfirm = useCallback(async () => {
		const ok = await handleConfirmProposal(proposalId);
		if (ok) {
			await handleGetProposal(proposalId);
			navigation.reset({
				index: 0,
				routes: [{ name: "Home", params: { screen: "AndamentoTab" } }],
			});
		}
	}, [handleConfirmProposal, handleGetProposal, navigation, proposalId]);

	const handleDecline = useCallback(() => {
		Alert.alert(
			t("PROPOSAL.DECLINE_TITLE"),
			t("PROPOSAL.DECLINE_MESSAGE"),
			[
				{ text: t("COMMON.CANCEL"), style: "cancel" },
				{
					text: t("PROPOSAL.DECLINE_ACTION"),
					style: "destructive",
					onPress: async () => {
						const declined = await handleDeclineProposal(proposalId);
						if (declined) {
							navigation.goBack();
						}
					},
				},
			],
		);
	}, [handleDeclineProposal, navigation, proposalId, t]);

	const handleCancel = useCallback(() => {
		Alert.alert(
			t("PROPOSAL.CANCEL_TITLE"),
			t("PROPOSAL.CANCEL_MESSAGE"),
			[
				{ text: t("COMMON.CANCEL"), style: "cancel" },
				{
					text: t("PROPOSAL.CANCEL_ACTION"),
					style: "destructive",
					onPress: async () => {
						const cancelled = await handleCancelProposal(proposalId);
						if (cancelled) {
							navigation.goBack();
						}
					},
				},
			],
		);
	}, [handleCancelProposal, navigation, proposalId, t]);

	if (isLoading && proposal == null) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["left", "right", "bottom"]}>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color={iconColor} />
				</View>
			</SafeAreaView>
		);
	}

	if (!proposal) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 }} edges={["left", "right", "bottom"]}>
				<View className="flex-1 items-center justify-center">
					<Text className="text-base text-center" style={{ color: colors.textSecondary }}>
						{t("PROPOSAL.NOT_FOUND")}
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingBottom: 16 }} edges={["left", "right", "bottom"]}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
				{isAwaitingDriver ? (
					<View
						className="rounded-xl p-4 mb-4"
						style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B", borderWidth: 1 }}
					>
						<Text className="text-sm font-semibold" style={{ color: "#92400E" }}>
							{t("PROPOSAL.AWAITING_DRIVER_HINT")}
						</Text>
					</View>
				) : null}

				<View className="rounded-2xl p-3 mb-5" style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}>
					<View className="flex-row justify-between items-start">
						<View className="flex-1 pr-2">
							<Text className="text-xl font-semibold" style={{ color: colors.text }} numberOfLines={1}>
								{freight?.name ?? t("COMMON.EMPTY")}
							</Text>
							<Text className="text-sm mt-2" style={{ color: colors.textSecondary }} numberOfLines={1}>
								{t("PROPOSAL.ORIGIN_SHORT")}: {freight?.origin_label ?? t("COMMON.EMPTY")}
							</Text>
							<Text className="text-sm mt-1" style={{ color: colors.textSecondary }} numberOfLines={1}>
								{t("PROPOSAL.DESTINATION_SHORT")}: {freight?.destination_label ?? t("COMMON.EMPTY")}
							</Text>
							<Image source={require("@/src/assets/Logos.png")} className="mt-1" resizeMode="contain" />
							<Text className="font-semibold text-sm mt-1" style={{ color: colors.text }}>
								{t("PROPOSAL.FREIGHT_VALUE")}: {formatMoneyLabel(freightValue)}
							</Text>
						</View>

						<View className="items-end flex-1">
							<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
								{freight?.cargo?.name ?? t("COMMON.EMPTY")} / {freight?.weight ?? t("COMMON.N_A")} kg
							</Text>
							<Image source={require("@/src/assets/carga.png")} className="w-full h-24" resizeMode="contain" />
						</View>
					</View>
				</View>

				<View className="rounded-2xl p-4 mb-5" style={{ backgroundColor: colors.bgNonary }}>
					<View className="flex-row items-center justify-between mb-4">
						<Text className="text-lg font-semibold" style={{ color: colors.text }}>
							{t("PROPOSAL.PROPOSAL_DETAILS")}
						</Text>
						<View className="rounded-full px-3 py-1" style={{ backgroundColor: statusStyle.backgroundColor }}>
							<Text className="text-sm font-semibold" style={{ color: statusStyle.color }}>
								{statusName}
							</Text>
						</View>
					</View>

					<DetailRow label={t("PROPOSAL.PROPOSAL_VALUE")} value={formatMoneyLabel(proposal.value)} />
					<DetailRow label={t("PROPOSAL.STATUS")} value={statusName} />
					<DetailRow label={t("PROPOSAL.SENT_AT")} value={formatDateLabel(proposal.createdAt)} />
				</View>

				<View className="rounded-2xl p-4" style={{ backgroundColor: colors.bgNonary }}>
					<Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
						{t("PROPOSAL.FREIGHT_DETAILS")}
					</Text>
					<DetailRow label={t("FREIGHT.ORIGIN")} value={freight?.origin_label ?? t("COMMON.EMPTY")} />
					<DetailRow label={t("FREIGHT.DESTINATION")} value={freight?.destination_label ?? t("COMMON.EMPTY")} />
					<DetailRow label={t("FREIGHT.WEIGHT")} value={freight?.weight != null ? `${freight.weight} kg` : t("COMMON.EMPTY")} />
					<DetailRow label={t("FREIGHT.DEADLINE")} value={freight?.daysLimit != null ? t("FREIGHT.DEADLINE_VALUE", { days: freight.daysLimit }) : t("COMMON.EMPTY")} />
					<DetailRow label={t("PROPOSAL.CARGO_TYPE")} value={freight?.cargo?.name ?? t("COMMON.EMPTY")} />
				</View>
			</ScrollView>

			{isAwaitingDriver ? (
				<View className="gap-2">
					<ButtonApproved
						title={t("PROPOSAL.ACCEPT_FREIGHT")}
						onPress={handleConfirm}
						loading={isConfirming}
						disabled={isConfirming}
					/>
					<ButtonCancel
						title={t("PROPOSAL.DECLINE_ACTION")}
						onPress={handleDecline}
						disabled={isConfirming}
					/>
				</View>
			) : isSent ? (
				<ButtonCancel
					title={t("PROPOSAL.CANCEL_ACTION")}
					onPress={handleCancel}
					loading={isCancelling}
					disabled={isCancelling}
				/>
			) : null}
		</SafeAreaView>
	);
};

export default ProposalDetail;
