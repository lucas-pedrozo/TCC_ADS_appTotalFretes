import { useMemo, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { CargoTypeImage } from "@/src/components/freight/CargoTypeImage";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { ButtonApproved } from "@/src/components/form/buttons/ButtonDefault";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useCreateProposal } from "@/src/hooks/proposal/useCreateProposal";
import { useDriverVehicle } from "@/src/hooks/vehicle/useDriverVehicle";
import type { RootStackParamList } from "@/src/routes/Routes";
import { maskMoney, parseMoneyToNumber } from "@/src/utils/formMask";
import { formatWeight, parseAddressLabel } from "@/src/utils/format";
import { isVehicleCompatibleWithFreight } from "@/src/utils/vehicleFreightCompatibility";

type SendProposalRouteProp = RouteProp<RootStackParamList, "SendProposal">;

const DetailLine = ({ label, value }: { label: string; value: string }) => {
	const colors = useThemeColors();

	return (
		<View className="flex-row items-center justify-between py-2">
			<Text className="text-base" style={{ color: colors.textSecondary }}>{label}</Text>
			<Text className="text-base font-medium text-right flex-1 ml-4" style={{ color: colors.text }}>{value}</Text>
		</View>
	);
};

const SendProposal = () => {
	const route = useRoute<SendProposalRouteProp>();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const colors = useThemeColors();
	const { t } = useTranslation();
	const inputRef = useRef<TextInput>(null);
	const freight = route.params.freight;
	const { notify } = useAlertDefault();
	const { driverVehicle } = useDriverVehicle();
	const { isLoading, handleCreateProposal } = useCreateProposal();

	const referenceValue = freight.finalValue ?? freight.originalValue ?? 0;
	const [proposalValue, setProposalValue] = useState(maskMoney(referenceValue));

	const origin = useMemo(() => parseAddressLabel(freight.origin_label), [freight.origin_label]);
	const destination = useMemo(() => parseAddressLabel(freight.destination_label), [freight.destination_label]);
	const proposalNumber = parseMoneyToNumber(proposalValue);
	const formattedProposal = proposalValue ? `R$ ${proposalValue}` : "R$ 0,00";
	const freightValueText = referenceValue > 0 ? `R$ ${maskMoney(referenceValue)}` : t("COMMON.EMPTY");

	const handleChangeProposal = (value: string) => {
		setProposalValue(maskMoney(value));
	};

	const handleSubmit = async () => {
		if (proposalNumber <= 0 || isLoading) return;

		if (!isVehicleCompatibleWithFreight(driverVehicle, freight)) {
			notify({
				status: "error",
				message: t("FREIGHT.VALIDATION.VEHICLE_INCOMPATIBLE"),
			});
			return;
		}

		const proposal = await handleCreateProposal({
			freight_id: freight.id,
			value: proposalNumber,
		});

		if (proposal) {
			navigation.navigate("Home", { screen: "PropostaTab" });
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16,  }} edges={["left", "right", "bottom"]}>
			<KeyboardAwareScrollView
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<View className="flex-1">
					<View className="rounded-2xl p-2.5 mb-5" style={{ backgroundColor: colors.bgNonary }}>
						<View className="flex-row justify-between items-start">
							<View className="flex-1 pr-2">
								<Text className="text-xl font-semibold" style={{ color: colors.text }} numberOfLines={1}>
									{freight.name}
								</Text>
								<Text className="text-sm mt-2" style={{ color: colors.textSecondary }} numberOfLines={1}>
									{t("PROPOSAL.ORIGIN_SHORT")}: {freight.origin_label}
								</Text>
								<Text className="text-sm mt-1" style={{ color: colors.textSecondary }} numberOfLines={1}>
									{t("PROPOSAL.DESTINATION_SHORT")}: {freight.destination_label}
								</Text>
								<Image source={require("@/src/assets/Logos.png")} className="mt-1" resizeMode="contain" />
								<Text className="font-semibold text-sm mt-1" style={{ color: colors.text }}>
									{t("PROPOSAL.FREIGHT_VALUE")}: {freightValueText}
								</Text>
							</View>

							<View className="items-end flex-1">
								<Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
									{freight.cargo?.name ?? t("COMMON.EMPTY")} / {formatWeight(freight.weight)}
								</Text>
								<CargoTypeImage cargo={freight.cargo} className="w-full h-24" resizeMode="contain" />
							</View>
						</View>
					</View>

					<View className="mb-3">
						<Text className="text-lg font-semibold mb-2" style={{ color: colors.text }}>{t("PROPOSAL.PICKUP")}</Text>
						<DetailLine label={t("PROPOSAL.CITY")} value={origin.city} />
						<DetailLine label={t("PROPOSAL.STREET")} value={origin.street} />
						<DetailLine label={t("PROPOSAL.NUMBER")} value={origin.number} />
					</View>

					<View className="h-px mb-3" style={{ backgroundColor: colors.bgNonary }} />

					<View className="mb-3">
						<Text className="text-lg font-semibold mb-2" style={{ color: colors.text }}>{t("PROPOSAL.DESTINATION")}</Text>
						<DetailLine label={t("PROPOSAL.CITY")} value={destination.city} />
						<DetailLine label={t("PROPOSAL.STREET")} value={destination.street} />
						<DetailLine label={t("PROPOSAL.NUMBER")} value={destination.number} />
					</View>

					<View className="h-px mb-3" style={{ backgroundColor: colors.bgNonary }} />

					<View>
						<Text className="text-lg font-semibold mb-2" style={{ color: colors.text }}>{t("PROPOSAL.CARGO_VALUE")}</Text>
						<DetailLine label={t("PROPOSAL.CARGO_VALUE_LABEL")} value={freightValueText} />
					</View>
				</View>

				<View className="rounded-2xl p-3 mt-3" style={{ backgroundColor: colors.bgQuinary }}>
					<Text className="text-lg font-semibold mb-3 text-black">{t("PROPOSAL.FREIGHT_VALUE")}</Text>

					<View className="flex-row items-center gap-2 mb-3">
						<Text className="text-base text-black">{t("PROPOSAL.PROPOSAL")}:</Text>
						<TextInput
							ref={inputRef}
							value={formattedProposal}
							onChangeText={handleChangeProposal}
							keyboardType="numeric"
							className="flex-1 rounded-lg px-3 py-2 text-base"
							style={{ backgroundColor: "#5CD28E", color: "#0F3D25" }}
							editable={!isLoading}
						/>
						<Pressable
							onPress={() => inputRef.current?.focus()}
							className="rounded-lg p-3"
							style={{ backgroundColor: "rgba(92, 210, 142, 0.35)" }}
						>
							<Feather name="edit-2" size={20} color="#0F172A" />
						</Pressable>
					</View>

					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-base text-black">{t("PROPOSAL.FINAL_VALUE")}:</Text>
						<Text className="text-base font-medium text-black">{formattedProposal}</Text>
					</View>

					<ButtonApproved
						title={t("PROPOSAL.SEND")}
						onPress={handleSubmit}
						loading={isLoading}
						disabled={proposalNumber <= 0}
					/>
				</View>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
};

export default SendProposal;
