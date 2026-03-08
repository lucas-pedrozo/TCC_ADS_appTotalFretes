import { ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { useThemeColors } from "@/src/context/ThemeContext";

export type ButtonProps = {
	title: string;
	loading?: boolean;
	disabled?: boolean;
	onPress: () => void;
};

export const ButtonDefault = ({ title, onPress, disabled, loading }: ButtonProps) => {
	const colors = useThemeColors();

	return (
		<TouchableOpacity
			className="py-3 w-full rounded-lg items-center"
			style={{ backgroundColor: colors.bgQuaternary }}
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator size="small" color={colors.textTertiary} />
			) : (
				<Text className="font-semibold text-base" style={{ color: colors.textTertiary }}>
					{title}
				</Text>
			)}
		</TouchableOpacity>
	);
};

export const ButtonApproved = ({ title, onPress, disabled, loading }: ButtonProps) => {
	return (
		<TouchableOpacity
			className="bg-green-500 py-3 w-full rounded-lg items-center"
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator size="small" color="#FFFFFF" />
			) : (
				<Text className="text-white font-semibold text-base">{title}</Text>
			)}
		</TouchableOpacity>
	);
};

export const ButtonCancel = ({ title, onPress, disabled, loading }: ButtonProps) => {
	return (
		<TouchableOpacity
			className="bg-red-500 py-3 w-full rounded-lg items-center"
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator size="small" color="#FFFFFF" />
			) : (
				<Text className="text-white font-semibold text-base">{title}</Text>
			)}
		</TouchableOpacity>
	);
};
