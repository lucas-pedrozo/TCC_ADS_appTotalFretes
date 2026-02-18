import { useCallback } from "react";

import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function Start() {
	const navigation = useNavigation<NavigationProp>();

	const goLogin = useCallback(() => navigation.navigate("Login"), [navigation]);
	const goSingUp = useCallback(() => navigation.navigate("SingUp"), [navigation]);

	return (
		<SafeAreaView className="flex-1 justify-center items-center px-5">
			<View className="pt-4">
				<Text className="text-lightText dark:text-darkText text-5xl font-bold text-center">
					Total Frete
				</Text>
			</View>

			<View className="h-1/4" />

			<View className="w-full gap-4 pb-4">
				<ButtonDefault
					title="Entrar"
					onPress={goLogin}
				/>
				<ButtonDefault
					title="Cadastre-se"
					onPress={goSingUp}
				/>
			</View>
		</SafeAreaView>
	);
}

export default Start;