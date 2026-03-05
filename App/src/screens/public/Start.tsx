import { useCallback, useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Text, View, Modal, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { getStoredOverride, setOverrideBaseURL } from "@/src/service/http";
import { useThemeMode } from "@/src/context/ThemeContext";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function Start() {
	const navigation = useNavigation<NavigationProp>();
	const { t } = useTranslation();
	const { mode } = useThemeMode();
	const [configModalVisible, setConfigModalVisible] = useState(false);
	const [configIpValue, setConfigIpValue] = useState("");

	const goLogin = useCallback(() => navigation.navigate("Login"), [navigation]);
	const goSingUp = useCallback(() => navigation.navigate("SingUp"), [navigation]);

	const openConfig = useCallback(() => {
		getStoredOverride().then((stored) => {
			setConfigIpValue(stored ?? "");
			setConfigModalVisible(true);
		});
	}, []);

	const saveConfig = useCallback(async () => {
		const value = configIpValue.trim();
		await setOverrideBaseURL(value || null);
		setConfigModalVisible(false);
	}, [configIpValue]);

	useEffect(() => {
		if (configModalVisible) {
			getStoredOverride().then((stored) => setConfigIpValue(stored ?? ""));
		}
	}, [configModalVisible]);

	return (
		<SafeAreaView className="flex-1 justify-center items-center px-3">
			<View className="absolute top-4 right-4 z-10">
				<TouchableOpacity
					onPress={openConfig}
					className="bg-lightBgNonary dark:bg-darkBgNonary p-2.5 rounded-xl"
					accessibilityLabel="Configuração do servidor"
				>
					<Ionicons name="settings-outline" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
				</TouchableOpacity>
			</View>

			<View className="pt-4">
				<Text className="text-lightText dark:text-darkText text-5xl font-bold text-center">
					{t("COMMON.APPNAME")}
				</Text>
			</View>

			<View className="h-1/4" />

			<View className="w-full gap-4 pb-4">
				<ButtonDefault
					title={t("START.SIGNIN")}
					onPress={goLogin}
				/>
				<ButtonDefault
					title={t("START.SIGNUP")}
					onPress={goSingUp}
				/>
			</View>

			<Modal
				visible={configModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setConfigModalVisible(false)}
			>
				<TouchableOpacity
					activeOpacity={1}
					className="flex-1 bg-black/50 justify-center items-center px-6"
					onPress={() => setConfigModalVisible(false)}
				>
					<TouchableOpacity
						activeOpacity={1}
						className="w-full bg-lightBg dark:bg-darkBg rounded-2xl p-5 border border-lightBgTertiary dark:border-darkBgTertiary"
						onPress={(e) => e.stopPropagation()}
					>
						<View className="flex-row items-center justify-between mb-4">
							<Text className="text-lightText dark:text-darkText font-bold text-lg">
								Configuração do servidor
							</Text>
							<TouchableOpacity onPress={() => setConfigModalVisible(false)} hitSlop={12}>
								<Ionicons name="close" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
							</TouchableOpacity>
						</View>
						<Text className="text-lightTextSecondary dark:text-darkTextSecondary text-sm mb-2">
							IP ou URL do servidor (ex: 192.168.0.101 ou http://192.168.0.101). Deixe vazio para usar o valor do .env.
						</Text>
						<TextInput
							value={configIpValue}
							onChangeText={setConfigIpValue}
							placeholder="Ex: 192.168.0.101"
							placeholderTextColor="#9ca3af"
							className="bg-lightBgNonary dark:bg-darkBgNonary text-lightText dark:text-darkText rounded-xl px-4 py-3 text-base mb-4"
							autoCapitalize="none"
							autoCorrect={false}
							keyboardType="url"
						/>
						<TouchableOpacity
							onPress={saveConfig}
							className="bg-[#3498db] dark:bg-[#2980b9] py-3 rounded-xl items-center"
						>
							<Text className="text-white font-semibold">Salvar</Text>
						</TouchableOpacity>
					</TouchableOpacity>
				</TouchableOpacity>
			</Modal>
		</SafeAreaView>
	);
}

export default Start;