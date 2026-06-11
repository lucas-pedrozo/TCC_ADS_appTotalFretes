import React, { useState } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeColors } from "@/src/context/ThemeContext";
import { INPUT_STYLES, type InputBaseProps } from "./inputShared";
import animation from "@/src/utils/animation";

export type SelectOption = {
	value: string;
	label: string;
};

type InputSelectProps<T extends FieldValues = FieldValues> = Omit<
	InputBaseProps<T>,
	"type" | "secureTextEntry" | "autoFocus" | "maxLength"
> & {
	options: SelectOption[];
};

export function InputSelect<T extends FieldValues = FieldValues>({
	control,
	name,
	rules,
	label,
	placeholder,
	disabled = false,
	options,
}: InputSelectProps<T>) {
	const colors = useThemeColors();
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
				const selectedOption = options.find((option) => option.value === value);
				const hasValue = Boolean(value);

				const inputStyle = error
					? { backgroundColor: colors.bgSecondary, color: colors.textQuinary }
					: disabled
						? { backgroundColor: colors.bgSecondary, color: colors.text }
						: { backgroundColor: colors.bgNonary, color: colors.text };

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

						<Pressable
							onPress={() => !disabled && setModalVisible(true)}
							disabled={disabled}
							style={[inputStyle, { paddingRight: 40 }]}
							className={error ? INPUT_STYLES.error.input : disabled ? INPUT_STYLES.disabled.input : INPUT_STYLES.default.input}
						>
							<Text
								className="font-semibold text-base"
								style={{ color: hasValue ? colors.text : colors.textSecondary }}
							>
								{hasValue && selectedOption
									? `${selectedOption.value} - ${selectedOption.label}`
									: placeholder}
							</Text>
							<View className="absolute right-3">
								<Feather name="chevron-down" size={20} color={colors.textSecondary} />
							</View>
						</Pressable>

						{error ? (
							<Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text>
						) : null}

						<Modal
							visible={modalVisible}
							transparent
							animationType="fade"
							onRequestClose={() => setModalVisible(false)}
						>
							<Pressable
								style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}
								onPress={() => setModalVisible(false)}
							>
								<animation.FadeDown
									className="mx-4 rounded-2xl overflow-hidden"
									style={{ backgroundColor: colors.bgSecondary }}
									onStartShouldSetResponder={() => true}
								>
									<ScrollView className="max-h-80 py-2">
										{options.map((option) => (
											<Pressable
												key={option.value}
												onPress={() => {
													onChange(option.value);
													onBlur();
													setModalVisible(false);
												}}
												className="py-3.5 px-4 active:opacity-70"
											>
												<Text
													className="text-base font-medium"
													style={{ color: option.value === value ? colors.bgOctonary : colors.text }}
												>
													{option.value} - {option.label}
												</Text>
											</Pressable>
										))}
									</ScrollView>
								</animation.FadeDown>
							</Pressable>
						</Modal>
					</View>
				);
			}}
		/>
	);
}
