import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import { useThemeMode } from "@/src/context/ThemeContext";

type OptionProps = {
	title?: string;
	icon?: keyof typeof Ionicons.glyphMap;
	onPress?: () => void;
}

export const Option = (props: OptionProps) => {

	const { mode } = useThemeMode();

	return (
		<TouchableOpacity onPress={props.onPress} className="flex-row items-center justify-between">
			<View className="flex-row items-center justify-center gap-2.5">
				<View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
					<Ionicons name={props.icon} size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
				</View>
				<Text className="text-lightText dark:text-darkText font-semibold text-base">{props.title}</Text>
			</View>

			<Ionicons name="chevron-forward-outline" size={22} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
		</TouchableOpacity>
	)
}