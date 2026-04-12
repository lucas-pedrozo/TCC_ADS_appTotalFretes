import { TouchableOpacity, View, Text } from "react-native"

import { Image } from "expo-image"
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { useThemeColors, useIconColor } from "@/src/context/ThemeContext"

type CardUserLoginProps = {
	lastUsedAccount: { displayLabel: string; userImageUrl?: string; };
	biometricsEnabled?: boolean;
	goSwitchAccount: () => void;
	handleRemoveSavedAccount: () => void;
	goSavedAccount: () => void;
};

export const CardUserLogin = ({ lastUsedAccount, biometricsEnabled = false, goSwitchAccount, handleRemoveSavedAccount, goSavedAccount }: CardUserLoginProps) => {
	const { t } = useTranslation();
	const colors = useThemeColors();
	const iconColor = useIconColor();

	return (
		<>
			<TouchableOpacity onPress={goSavedAccount}
				className="mt-10 rounded-2xl px-4 py-4 flex-row items-center gap-4"
				style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}
			>
				{lastUsedAccount.userImageUrl ? (
					<Image source={{ uri: lastUsedAccount.userImageUrl }} style={{ width: 48, height: 48, borderRadius: 24 }} />
				) : (
					<View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
						<Feather name="user" size={24} color={iconColor} />
					</View>
				)}
				<View className="flex-1 min-w-0">
					<Text className="text-xs" style={{ color: colors.textSecondary }}>
						{t("LOGIN.SAVEDACCOUNT")}
					</Text>
					<Text className="text-lg font-semibold mt-1" style={{ color: colors.text }} numberOfLines={1}>
						{lastUsedAccount.displayLabel}
					</Text>
					<Text className="text-xs mt-1" style={{ color: colors.textSecondary }}>
						{t("LOGIN.PASSWORDLABEL")}
					</Text>
				</View>
				{biometricsEnabled ? (
					<View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
						<Ionicons name="finger-print-outline" size={22} color={iconColor} />
					</View>
				) : (
					<View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
						<MaterialIcons name="pin" size={22} color={iconColor} />
					</View>
				)}
			</TouchableOpacity>

			<View className="mt-4 flex-row justify-between items-center gap-x-6 gap-y-2 px-2.5 flex-wrap">
				<TouchableOpacity onPress={goSwitchAccount} className="flex-row items-center gap-2">
					<Feather name="repeat" size={18} color={iconColor} />
					<Text className="text-base font-medium" style={{ color: colors.text }}>
						{t("LOGIN.SWITCHACCOUNT")}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleRemoveSavedAccount} className="flex-row items-center gap-2">
					<Feather name="trash-2" size={18} color={iconColor} />
					<Text className="text-base font-medium" style={{ color: colors.text }}>
						{t("LOGIN.REMOVESAVEDACCOUNT")}
					</Text>
				</TouchableOpacity>
			</View>
		</>
	)
}