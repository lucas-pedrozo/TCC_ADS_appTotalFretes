import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useIconColor } from "@/src/context/ThemeContext";

type HeaderProps = {
	title?: string;
};

const Header = ({ title }: HeaderProps) => {
	const navigation = useNavigation();
	const iconColor = useIconColor();

	return (
		<View className="w-full py-4 flex-row items-center justify-between">
			<TouchableOpacity
				className="bg-lightBgSecondary dark:bg-darkBgTertiary p-2.5 rounded-md"
				onPress={() => navigation.goBack()}
			>
				<Ionicons name="arrow-back" size={20} color={iconColor} />
			</TouchableOpacity>

			<Text className="text-lightText dark:text-darkText font-bold text-xl text-center flex-1 mr-10">
				{title}
			</Text>
		</View>
	);
};

export default Header;
