import { Ionicons } from "@expo/vector-icons";
import { View, Text, Switch } from "react-native";
import { useThemeMode } from "@/src/context/ThemeContext";

type OptionProps = {
	title?: string;
	icon?: keyof typeof Ionicons.glyphMap;
	onPress?: () => void;
	value?: boolean;
	setValue?: (value: boolean) => void;
}

export const OptionKey = (props: OptionProps) => {

	const { mode } = useThemeMode();

	return (
		<View className="flex-row items-center justify-between">
			<View className="flex-row items-center justify-center gap-2.5">
				<View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
					<Ionicons name={props.icon} size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
				</View>
				<Text className="text-lightText dark:text-darkText font-semibold text-base">{props.title}</Text>
			</View>

			<Switch
				value={props.value}
				onValueChange={(val) => { if (props.setValue) props.setValue(val); }}
				trackColor={{ false: "#767577", true: "#00FF44" }}
				thumbColor={mode === "dark" ? "#f4f3f4" : "#f4f3f4"}
				ios_backgroundColor="#3e3e3e"
				style={{ transform: [{ scaleX: 1}, { scaleY: 1 }] }}
			/>
		</View>
	)
}