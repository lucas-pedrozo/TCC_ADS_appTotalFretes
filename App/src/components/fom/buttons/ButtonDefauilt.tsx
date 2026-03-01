import { TouchableOpacity, Text } from 'react-native';

export type ButtonProps = {
	title: string;
	loading?: boolean;
	disabled?: boolean;
	onPress: () => void;
}

export const ButtonDefault = ({ title, onPress, disabled, loading }: ButtonProps) => {
	return (
		<TouchableOpacity
			className="bg-lightBgQuaternary dark:bg-darkBgQuaternary py-3  w-full rounded-lg items-center"
			onPress={onPress}
			disabled={disabled}
		>
			<Text className="text-lightTextTertiary dark:text-darkTextTertiary font-semibold text-base">
				{loading ? '' : ''}{title}
			</Text>
		</TouchableOpacity>
	)
};

export const ButtonApproved = ({ title, onPress, disabled, loading }: ButtonProps) => {
	return (
		<TouchableOpacity
			className="bg-green-500 py-3 w-full rounded-lg items-center"
			onPress={onPress}
			disabled={disabled}
		>
			<Text className="text-white font-semibold text-base">{loading ? '' : ''}{title}</Text>
		</TouchableOpacity>
	)
};

export const ButtonCancel = ({ title, onPress, disabled, loading }: ButtonProps) => {
	return (
		<TouchableOpacity
			className="bg-red-500 py-3 w-full rounded-lg items-center"
			onPress={onPress}
			disabled={disabled}
		>
			<Text className="text-white font-semibold text-base">{title}</Text>
		</TouchableOpacity>
	)
};