import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import {
	FREIGHT_HISTORY_STATUS_FILTER_OPTIONS,
	type FreightHistoryStatusFilter,
} from "@/src/types/freightHistoryFilter";
import animation from "@/src/utils/animation";

type ModalFreightHistoryFilterProps = {
	visible: boolean;
	onClose: () => void;
	onApply: (filter: FreightHistoryStatusFilter) => void;
	appliedFilter: FreightHistoryStatusFilter;
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

function ModalFreightHistoryFilter({
	visible,
	onClose,
	onApply,
	appliedFilter,
}: ModalFreightHistoryFilterProps) {
	const colors = useThemeColors();
	const { mode } = useThemeMode();
	const { t } = useTranslation();
	const [draft, setDraft] = useState<FreightHistoryStatusFilter>(appliedFilter);

	useEffect(() => {
		if (visible) {
			setDraft(appliedFilter);
		}
	}, [visible, appliedFilter]);

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
								{t("MODALFREIGHTHISTORYFILTER.TITLE")}
							</Text>
							<TouchableOpacity
								onPress={onClose}
								accessibilityRole="button"
								accessibilityLabel={t("MODALFREIGHTHISTORYFILTER.CLOSE_A11Y")}
							>
								<Ionicons name="close" size={24} color={closeIconColor} />
							</TouchableOpacity>
						</View>

						<Text className="text-sm mb-4" style={{ color: colors.textSecondary }}>
							{t("MODALFREIGHTHISTORYFILTER.SUBTITLE")}
						</Text>

						<View>
							<Text
								className="text-xs font-semibold uppercase tracking-wide mb-2"
								style={{ color: colors.textSecondary }}
							>
								{t("MODALFREIGHTHISTORYFILTER.STATUS")}
							</Text>
							<View className="flex-row flex-wrap gap-2">
								{FREIGHT_HISTORY_STATUS_FILTER_OPTIONS.map((option) => (
									<FilterChip
										key={option}
										label={t(`MODALFREIGHTHISTORYFILTER.STATUS_${option.toUpperCase()}`)}
										active={draft === option}
										onPress={() => setDraft(option)}
										colors={colors}
									/>
								))}
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
									{t("MODALFREIGHTHISTORYFILTER.CANCEL")}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 py-3 rounded-xl items-center"
								style={{ backgroundColor: colors.bgQuaternary }}
								onPress={handleApply}
								accessibilityRole="button"
							>
								<Text className="font-semibold" style={{ color: colors.textTertiary }}>
									{t("MODALFREIGHTHISTORYFILTER.APPLY")}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</animation.appleModal>
			</Pressable>
		</Modal>
	);
}

export default ModalFreightHistoryFilter;
