import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

type ButtonProps = {
	title: string;
	onPress: () => void;
	disabled?: boolean;
}

export const ButtonDefault = ({ title, onPress, disabled }: ButtonProps) => {
	return(
		<TouchableOpacity
			className={``}
			onPress={onPress}
			disabled={disabled}
		>
			<Text>{title}</Text>
		</TouchableOpacity>
	)
};

export const ButtonApproved = ({ title, onPress, disabled }: ButtonProps) => {
	return(
		<TouchableOpacity
			className={``}
			onPress={onPress}
			disabled={disabled}
		>
			<Text>{title}</Text>
		</TouchableOpacity>
	)
};

export const ButtonCancel = ({ title, onPress, disabled }: ButtonProps) => {
	return(
		<TouchableOpacity
			className={``}
			onPress={onPress}
			disabled={disabled}
		>
			<Text>{title}</Text>
		</TouchableOpacity>
	)
};