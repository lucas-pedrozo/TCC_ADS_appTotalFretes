import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import animation from "@/src/utils/animation";

type ModalLogoutProps = {
	visible: boolean;
	onConfirm: () => void;
	onCancel: () => void;
};

function ModalLogout({ visible, onConfirm, onCancel }: ModalLogoutProps) {
	const insets = useSafeAreaInsets();
	const { t } = useTranslation();

	if (!visible) return null;

	return (
		<View className="absolute inset-0 z-50 items-center ">
			<animation.iPhoneBounceDown
				style={{
					marginTop: insets.top + 16,
					width: "90%",
				}}
				className="rounded-xl bg-lightBg dark:bg-darkBgSecondary p-4"
			>
				<Text className="text-lightText dark:text-darkText text-base font-semibold text-center">
					{t("MODALLOGOUT.MESSAGE")}
				</Text>

				<View className="mt-4 flex-row gap-3">
					<TouchableOpacity
						className="flex-1 py-2.5 rounded-lg items-center bg-lightBgSecondary dark:bg-darkBgTertiary"
						onPress={onCancel}
					>
						<Text className="text-lightText dark:text-darkText font-semibold">{t("MODALLOGOUT.NO")}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="flex-1 py-2.5 rounded-lg items-center bg-lightBgQuaternary dark:bg-darkBgQuaternary"
						onPress={onConfirm}
					>
						<Text className="text-lightTextTertiary dark:text-darkTextTertiary font-semibold">{t("MODALLOGOUT.YES")}</Text>
					</TouchableOpacity>
				</View>
			</animation.iPhoneBounceDown>
		</View>
	);
}

export default ModalLogout;
