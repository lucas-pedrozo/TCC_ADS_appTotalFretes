import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import animation from "@/src/utils/animation";

type ModalLogoutProps = {
	visible: boolean;
	onConfirm: () => void;
	onCancel: () => void;
};

function ModalLogout({ visible, onConfirm, onCancel }: ModalLogoutProps) {
	const insets = useSafeAreaInsets();

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
					Deseja sair da conta?
				</Text>

				<View className="mt-4 flex-row gap-3">
					<TouchableOpacity
						className="flex-1 py-2.5 rounded-lg items-center bg-lightBgTertiary dark:bg-darkBgTertiary"
						onPress={onCancel}
					>
						<Text className="text-lightText dark:text-darkText font-semibold">Não</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="flex-1 py-2.5 rounded-lg items-center bg-lightBgQuaternary dark:bg-darkBgQuaternary"
						onPress={onConfirm}
					>
						<Text className="text-lightTextTertiary dark:text-darkTextTertiary font-semibold">Sim</Text>
					</TouchableOpacity>
				</View>
			</animation.iPhoneBounceDown>
		</View>
	);
}

export default ModalLogout;
