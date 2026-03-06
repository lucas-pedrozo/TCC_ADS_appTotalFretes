import { useCallback } from "react";

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonDefault } from "@/src/components/form";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function Start() {
	const navigation = useNavigation<NavigationProp>();
	const { t } = useTranslation();

	const goLogin = useCallback(() => navigation.navigate("Login"), [navigation]);
	const goSingUp = useCallback(() => navigation.navigate("SingUp"), [navigation]);

	return (
		<SafeAreaView className="flex-1 justify-center items-center px-3">
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
		</SafeAreaView>
	);
}

export default Start;