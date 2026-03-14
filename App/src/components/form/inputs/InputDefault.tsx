import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { View, Text, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useThemeColors } from "@/src/context/ThemeContext";
import { INPUT_STYLES, type InputBaseProps } from "./inputShared";
import animation from "@/src/utils/animation";

export function InputDefault({ id, control, name, rules, label, placeholder, type, secureTextEntry, autoFocus = false, maxLength, disabled = false }: InputBaseProps) {
	const colors = useThemeColors();
	const [passwordVisible, setPasswordVisible] = useState(false);

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
				const placeholderColor =
					error ? colors.textQuinary : colors.textSecondary;

				return (
					<View>
						{label ? (
							<Text
								className={error ? INPUT_STYLES.error.label : disabled ? INPUT_STYLES.disabled.label : INPUT_STYLES.default.label}
								style={error ? { color: colors.textQuinary } : { color: colors.text }}
							>
								{label}
							</Text>
						) : null}
						<View className="relative justify-center">
							<TextInput
								id={id}
								onBlur={onBlur}
								autoFocus={autoFocus}
								keyboardType={type}
								maxLength={maxLength}
								value={String(value ?? "")}
								onChangeText={onChange}
								placeholder={placeholder}
								placeholderTextColor={placeholderColor}
								secureTextEntry={secureTextEntry && !passwordVisible}
								editable={!disabled}
								style={[inputStyle, secureTextEntry ? { paddingRight: 48 } : undefined]}
								className={error ? INPUT_STYLES.error.input : disabled ? INPUT_STYLES.disabled.input : INPUT_STYLES.default.input}
							/>
							{secureTextEntry ? (
								<Pressable onPress={() => setPasswordVisible((prev) => !prev)} className="absolute right-3 p-1" hitSlop={8}>
									<Feather name={passwordVisible ? "eye" : "eye-off"} size={20} color={colors.textSecondary} />
								</Pressable>
							) : null}
						</View>
						{error ? (
							<Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text>
						) : null}
					</View>
				);
			}}
		/>
	);
}