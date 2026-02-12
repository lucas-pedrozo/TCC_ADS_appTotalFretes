import { useCallback } from "react";

import { ButtonProps } from "@/src/components/fom/buttons/ButtonDefauilt";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/src/routes/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeMode } from "@/src/context/ThemeContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const Button = ({ title, onPress, disabled, loading }: ButtonProps) => {
	return (
		<TouchableOpacity
			className="bg-white py-2.5 w-full rounded-lg items-center"
			onPress={onPress}
			disabled={disabled}
		>
			<Text className="text-black font-semibold text-base">{loading ? '' : ''}{title}</Text>
		</TouchableOpacity >
	)
}

function Start() {

	const navigation = useNavigation<NavigationProp>();
	const goLogin = useCallback(() => navigation.navigate('Login'), [navigation]);
	const { mode, toggleMode } = useThemeMode();

	return (
		<ImageBackground
			source={require("../../assets/bgStart.png")}
			resizeMode="cover"
			className="flex-1"
		>
			<SafeAreaView className="flex-1 justify-center bg-black/40 px-5">
				
				<View className="pt-4">
					<Text className="text-white text-5xl font-bold text-center">
						Total Fretes
					</Text>
				</View>
				<View className="h-1/4" />
				<View className="w-full gap-4 pb-4">
					<Button
						title="Entrar"
						onPress={goLogin}
						disabled={false}
					/>
					<Button
						title="Cadastre-se"
						onPress={() => console.log("cadastre-se")}
						disabled={false}
					/>
				</View>
				<View className="flex-row justify-center">
					<TouchableOpacity
						className="bg-lightBgQuaternary dark:bg-darkBgQuaternary px-3 py-2 rounded-md"
						onPress={toggleMode}
					>
						<Text className="text-lightTextTertiary dark:text-darkTextTertiary font-semibold text-sm">
							Tema: {mode === "dark" ? "Escuro" : "Claro"}
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</ImageBackground>
	);
}

export default Start;