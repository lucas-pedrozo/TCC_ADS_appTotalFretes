import { useCallback } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import type { CompanyMap } from "@/src/context/FreightUserContext";
import { IconBox } from "@/src/components/ui/IconBox";
import { buildTelUrl, formatPhoneDisplay } from "@/src/utils/phoneContact";

type FreightCompanyContactProps = {
	company?: CompanyMap | null;
};

export function FreightCompanyContact({ company }: FreightCompanyContactProps) {
	const colors = useThemeColors();
	const iconColor = useIconColor();
	const { t } = useTranslation();
	const { notify } = useAlertDefault();

	const phoneNumber = company?.phoneNumber?.trim() ?? "";
	const phoneDisplay = formatPhoneDisplay(phoneNumber) || t("COMMON.EMPTY");
	const canCall = buildTelUrl(phoneNumber) != null;

	const handleCall = useCallback(async () => {
		const telUrl = buildTelUrl(phoneNumber);
		if (!telUrl) return;

		try {
			await Linking.openURL(telUrl);
		} catch {
			await notify({
				status: "error",
				message: t("FREIGHT.CALL_COMPANY_ERROR"),
			});
		}
	}, [notify, phoneNumber, t]);

	return (
		<View
			style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1 }}
			className="p-4 rounded-xl gap-2.5"
		>
			<IconBox name="business-outline" />
			<View>
				<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
					{t("FREIGHT.COMPANY")}: {company?.name?.trim() || t("COMMON.EMPTY")}
				</Text>
				<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
					{t("FREIGHT.COMPANY_CITY")}: {company?.city?.trim() || t("COMMON.EMPTY")}
				</Text>
				<Text style={{ color: colors.text }} className="text-sm font-semibold opacity-80">
					{t("FREIGHT.COMPANY_PHONE")}: {phoneDisplay}
				</Text>
			</View>

			<Pressable
				onPress={handleCall}
				disabled={!canCall}
				className="flex-row items-center justify-center gap-2 py-3 rounded-xl"
				style={{
					backgroundColor: colors.bgNonary,
					opacity: canCall ? 1 : 0.45,
				}}
				accessibilityRole="button"
				accessibilityLabel={t("FREIGHT.CALL_COMPANY_A11Y")}
			>
				<Ionicons name="call-outline" size={18} color={iconColor} />
				<Text className="text-sm font-semibold" style={{ color: colors.text }}>
					{t("FREIGHT.CALL_COMPANY")}
				</Text>
			</Pressable>
		</View>
	);
}
