import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useIconColor, useThemeColors, useThemeMode } from "@/src/context/ThemeContext";

type HeaderProps = {
	title?: string;
};

const Header = ({ title }: HeaderProps) => {
	const colors = useThemeColors();
	const { mode } = useThemeMode();
	const navigation = useNavigation();
	const iconColor = useIconColor();
	const backButtonBg = mode === "light" ? colors.bgSecondary : colors.bgTertiary;

	return (
		<View className="w-full py-4 flex-row items-center justify-between">
			<TouchableOpacity
				className="p-2.5 rounded-md"
				style={{ backgroundColor: backButtonBg }}
				onPress={() => navigation.goBack()}
			>
				<Ionicons name="arrow-back" size={20} color={iconColor} />
			</TouchableOpacity>

			<Text className="font-bold text-xl text-center flex-1 mr-10" style={{ color: colors.text }}>
				{title}
			</Text>
		</View>
	);
};

export default Header;
