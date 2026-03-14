import React from "react";
import { Controller } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

import { useThemeColors } from "@/src/context/ThemeContext";
import { maskPlate } from "@/src/utils/formMask";

import { INPUT_STYLES, onlyAlphanumeric, type InputBaseProps } from "./inputShared";

const PLATE_MAX_LENGTH = 8;

export function InputPlate({
	id,
	control,
	name,
	rules,
	label,
	placeholder,
	disabled,
}: InputBaseProps) {
	const colors = useThemeColors();

	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
				const inputStyle =
					error
						? { backgroundColor: colors.bgSecondary, color: colors.textQuinary }
						: disabled
							? { backgroundColor: colors.bgSecondary, color: colors.text }
							: { backgroundColor: colors.bgNonary, color: colors.text };
				const placeholderColor = error ? colors.textQuinary : colors.textSecondary;

				return (
					<View>
						{label ? (
							<Text
								className={
									error ? INPUT_STYLES.error.label : disabled ? INPUT_STYLES.disabled.label : INPUT_STYLES.default.label
								}
								style={error ? { color: colors.textQuinary } : { color: colors.text }}
							>
								{label}
							</Text>
						) : null}
						<TextInput
							id={id}
							onBlur={onBlur}
							maxLength={PLATE_MAX_LENGTH}
							keyboardType="default"
							autoCapitalize="characters"
							autoCorrect={false}
							placeholder={placeholder}
							placeholderTextColor={placeholderColor}
							value={maskPlate(String(value ?? ""))}
							editable={!disabled}
							onChangeText={(text) => onChange(onlyAlphanumeric(text))}
							style={inputStyle}
							className={
								error ? INPUT_STYLES.error.input : disabled ? INPUT_STYLES.disabled.input : INPUT_STYLES.default.input
							}
						/>
						{error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
					</View>
				);
			}}
		/>
	);
}
