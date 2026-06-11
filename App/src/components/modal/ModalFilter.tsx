import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import type { FreightFilterState } from "@/src/types/freightFilter";
import animation from "@/src/utils/animation";

type ModalFilterProps = {
	visible: boolean;
	onClose: () => void;
	onApply: (filters: FreightFilterState) => void;
	currentCity: string;
	appliedFilters: FreightFilterState;
};

type FilterChipProps = {
	label: string;
	active: boolean;
	onPress: () => void;
	colors: ReturnType<typeof useThemeColors>;
};

function FilterChip({ label, active, onPress, colors }: FilterChipProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			className="px-3 py-2 rounded-xl border"
			style={{
				backgroundColor: active ? colors.bgQuaternary : colors.bgSecondary,
				borderColor: active ? colors.bgQuaternary : colors.bgNonary,
			}}
		>
			<Text className="text-sm font-medium" style={{ color: active ? colors.textTertiary : colors.text }}>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

function ModalFilter({ visible, onClose, onApply, currentCity, appliedFilters }: ModalFilterProps) {
	const colors = useThemeColors();
	const { mode } = useThemeMode();
	const { t } = useTranslation();
	const [draft, setDraft] = useState<FreightFilterState>(appliedFilters);

	useEffect(() => {
		if (visible) {
			setDraft(appliedFilters);
		}
	}, [visible, appliedFilters]);

	const handleApply = useCallback(() => {
		onApply(draft);
	}, [draft, onApply]);

	const closeIconColor = mode === "dark" ? "#FFFFFF" : "#000000";

	return (
		<Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
			<Pressable onPress={onClose} className="flex-1 bg-black/50">
				<animation.appleModal className="flex-1 justify-end">
					<View className="rounded-t-2xl p-4" style={{ backgroundColor: colors.bg }}>
						<View className="flex-row justify-between items-center mb-4">
							<Text className="font-semibold text-lg flex-1 pr-2" style={{ color: colors.text }}>
								{t("MODALFILTER.TITLE")}
							</Text>
							<TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel={t("MODALFILTER.CLOSE_A11Y")}>
								<Ionicons name="close" size={24} color={closeIconColor} />
							</TouchableOpacity>
						</View>

						<Text className="text-sm mb-4" style={{ color: colors.textSecondary }}>
							{t("MODALFILTER.SUBTITLE")}
						</Text>

						<View className="gap-5">
							<View>
								<Text className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: colors.textSecondary }}>
									{t("MODALFILTER.ORDER")}
								</Text>
								<View className="flex-row flex-wrap gap-2">
									<FilterChip
										label={t("MODALFILTER.NEARBY")}
										active={draft.order === "proximo"}
										onPress={() => setDraft((d) => ({ ...d, order: "proximo" }))}
										colors={colors}
									/>
									<FilterChip
										label={t("MODALFILTER.FAR")}
										active={draft.order === "longe"}
										onPress={() => setDraft((d) => ({ ...d, order: "longe" }))}
										colors={colors}
									/>
								</View>
							</View>

							<View>
								<Text className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: colors.textSecondary }}>
									{t("MODALFILTER.VALUE")}
								</Text>
								<View className="flex-row flex-wrap gap-2">
									<FilterChip
										label={t("MODALFILTER.ALL")}
										active={draft.value === "todos"}
										onPress={() => setDraft((d) => ({ ...d, value: "todos" }))}
										colors={colors}
									/>
									<FilterChip
										label={t("MODALFILTER.LOWER")}
										active={draft.value === "menores"}
										onPress={() => setDraft((d) => ({ ...d, value: "menores" }))}
										colors={colors}
									/>
									<FilterChip
										label={t("MODALFILTER.HIGHER")}
										active={draft.value === "maiores"}
										onPress={() => setDraft((d) => ({ ...d, value: "maiores" }))}
										colors={colors}
									/>
								</View>
							</View>

							<View className="rounded-xl px-3 py-2.5" style={{ backgroundColor: colors.bgSecondary }}>
								<Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: colors.textSecondary }}>
									{t("MODALFILTER.CURRENTCITY")}
								</Text>
								<Text className="text-sm font-medium mt-1" style={{ color: colors.text }} numberOfLines={2}>
									{currentCity}
								</Text>
							</View>
						</View>

						<View className="mt-5 flex-row gap-3">
							<TouchableOpacity
								className="flex-1 py-3 rounded-xl items-center"
								style={{ backgroundColor: colors.bgSecondary }}
								onPress={onClose}
								accessibilityRole="button"
							>
								<Text className="font-semibold" style={{ color: colors.text }}>
									{t("MODALFILTER.CANCEL")}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 py-3 rounded-xl items-center"
								style={{ backgroundColor: colors.bgQuaternary }}
								onPress={handleApply}
								accessibilityRole="button"
							>
								<Text className="font-semibold" style={{ color: colors.textTertiary }}>
									{t("MODALFILTER.APPLY")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</animation.appleModal>
			</Pressable>
		</Modal>
	);
}

export default ModalFilter;
