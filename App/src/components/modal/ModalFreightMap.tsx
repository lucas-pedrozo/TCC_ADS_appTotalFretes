import React from "react";
import {
	Dimensions,
	Image,
	Modal,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { FreightUserMap } from "@/src/interfaces/freight";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import animation from "@/src/utils/animation";

const MAX_SHEET_HEIGHT = Dimensions.get("window").height * 0.78;

export interface ModalFreightMapProps {
	visible: boolean;
	onClose: () => void;
	freight: FreightUserMap | null;
}

/**
 * Bottom sheet no estilo {@link ModalNotificacoes} para exibir os mesmos dados do {@link CardFreight} no mapa.
 */
export default function ModalFreightMap({ visible, onClose, freight }: ModalFreightMapProps) {
	const colors = useThemeColors();
	const { mode } = useThemeMode();
	const { t } = useTranslation();

	const closeIconColor = mode === "dark" ? "#FFFFFF" : "#000000";

	return (
		<Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
			<View className="flex-1 justify-end">
				<Pressable
					onPress={onClose}
					className="absolute inset-0 bg-black/50"
					accessibilityRole="button"
					accessibilityLabel="Fechar"
				/>
				<animation.appleModal className="flex-1 justify-end" pointerEvents="box-none">
					<View
						className="rounded-t-2xl px-4 pb-6 pt-2"
						style={{
							backgroundColor: colors.bg,
							maxHeight: MAX_SHEET_HEIGHT,
							borderTopWidth: 1,
							borderColor: colors.bgNonary,
						}}
					>
						<View className="mb-3 h-1 w-10 self-center rounded-full" style={{ backgroundColor: colors.bgNonary }} />

						<View className="mb-3 flex-row items-center justify-between">
							<Text className="pr-2 text-lg font-semibold" style={{ color: colors.text }}>
								{t("MODALFREIGHTMAP.TITLE")}
							</Text>
							<TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
								<Ionicons name="close" size={24} color={closeIconColor} />
							</TouchableOpacity>
						</View>

						<ScrollView
							showsVerticalScrollIndicator={false}
							bounces={false}
							contentContainerStyle={{ paddingBottom: 8 }}
						>
							<View className="mb-3 rounded-xl p-3" style={{ backgroundColor: colors.bgSecondary }}>
								<Text className="text-base font-semibold" style={{ color: colors.text }}>
									{freight?.vehicle_group?.name ?? t("CARD.ACTIVITY.NONE")}
								</Text>
								<Text className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
									{freight?.cargo?.name ?? t("CARD.ACTIVITY.NONE")} /{" "}
									{freight?.cargo?.weight ?? t("CARD.ACTIVITY.N_A")}
								</Text>
							</View>

							<View className="mb-3 rounded-xl p-3" style={{ backgroundColor: colors.bgSecondary }}>
								<View className="flex-row items-start gap-2">
									<Ionicons name="location-outline" size={20} color={colors.bgOctonary} style={{ marginTop: 2 }} />
									<View className="min-w-0 flex-1">
										<Text className="text-xs font-medium uppercase" style={{ color: colors.textSecondary }}>
											{t("CARD.FREIGHT.ORIGIN")}
										</Text>
										<Text className="mt-0.5 text-sm leading-5" style={{ color: colors.text }}>
											{freight?.origin_label ?? t("CARD.ACTIVITY.NONE")}
										</Text>
									</View>
								</View>
							</View>

							<View className="mb-3 rounded-xl p-3" style={{ backgroundColor: colors.bgSecondary }}>
								<View className="flex-row items-start gap-2">
									<Ionicons name="flag-outline" size={20} color={colors.bgOctonary} style={{ marginTop: 2 }} />
									<View className="min-w-0 flex-1">
										<Text className="text-xs font-medium uppercase" style={{ color: colors.textSecondary }}>
											{t("CARD.FREIGHT.DESTINATION")}
										</Text>
										<Text className="mt-0.5 text-sm leading-5" style={{ color: colors.text }}>
											{freight?.destination_label ?? t("CARD.ACTIVITY.NONE")}
										</Text>
									</View>
								</View>
							</View>

							<View
								className="flex-row items-center justify-between gap-3 rounded-xl p-3"
								style={{ backgroundColor: colors.bgSecondary }}
							>
								<View className="min-w-0 flex-1">
									<Image
										source={require("@/src/assets/Logos.png")}
										className="h-8 max-w-[120px]"
										resizeMode="contain"
									/>
									<Text className="mt-2 text-base font-semibold" style={{ color: colors.text }}>
										{t("CARD.FREIGHT.FREIGHT")}: R$ {freight?.final_value ?? t("CARD.ACTIVITY.N_A")}
									</Text>
								</View>
								<Image
									source={require("@/src/assets/carga.png")}
									style={{ width: 100, height: 88 }}
									resizeMode="contain"
								/>
							</View>
						</ScrollView>
					</View>
				</animation.appleModal>
			</View>
		</Modal>
	);
}
