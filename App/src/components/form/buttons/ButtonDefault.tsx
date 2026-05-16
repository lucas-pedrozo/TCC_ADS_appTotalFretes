import { ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { useThemeColors } from "@/src/context/ThemeContext";

export type ButtonProps = {
	title: string;
	loading?: boolean;
	disabled?: boolean;
	onPress: () => void;
	size?: "small" | "medium" | "full";
};

const sizeWidthClass: Record<NonNullable<ButtonProps["size"]>, string> = {
	full: "w-full",
	medium: "w-1/2",
	small: "w-[46%]",
};

const getSizeClass = (size: ButtonProps["size"] = "full") => sizeWidthClass[size];

export const ButtonDefault = ({ title, onPress, disabled, loading, size = "full" }: ButtonProps) => {
	const colors = useThemeColors();

	return (
		<TouchableOpacity
			className={`py-3 rounded-xl items-center ${getSizeClass(size)} ${disabled ? "opacity-50" : ""}`}
			style={{ backgroundColor: colors.bgQuaternary }}
			onPress={onPress}
			disabled={disabled || loading}
		>
			<Text className="font-semibold text-base" style={{ color: colors.textTertiary }}>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

export const ButtonNone = ({ title, onPress, disabled, loading, size = "full" }: ButtonProps) => {
	const colors = useThemeColors();

	return (
		<TouchableOpacity
			style={{ borderColor: colors.bg, borderWidth: 1 }}
			className={`py-3 rounded-lg items-center border border-gray-300 ${getSizeClass(size)}`}
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator size="small" color={colors.textTertiary} />
			) : (
				<Text className="font-semibold text-base" style={{ color: colors.text }}>
					{title}
				</Text>
			)}
		</TouchableOpacity>
	);
};

export const ButtonApproved = ({ title, onPress, disabled, loading, size = "full" }: ButtonProps) => {
	return (
		<TouchableOpacity
			className={`bg-green-500 py-3 rounded-lg items-center ${getSizeClass(size)}`}
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

export const ButtonCancel = ({ title, onPress, disabled, loading, size = "full" }: ButtonProps) => {
	return (
		<TouchableOpacity
			className={`bg-red-500 py-3 rounded-xl items-center ${getSizeClass(size)}`}
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
