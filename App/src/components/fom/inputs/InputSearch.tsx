import Ionicons from "@expo/vector-icons/build/Ionicons";
import React from "react"
import { Controller } from "react-hook-form"
import { View, TextInput } from "react-native"
import { useThemeMode } from "@/src/context/ThemeContext";

type InputProps = {
	label?: string;
	placeholder?: string;

	id?: string;
	control: any;
	name: string;
	rules?: object;
}

export const InputSearch = (props: InputProps) => {
  const { mode } = useThemeMode();

	return (
		<Controller
			control={props.control}
			name={props.name}
			rules={props.rules}
			render={({
				field: { onChange, onBlur, value },
			}) => {
				return (
					<View className="flex-1 flex-row items-center px-2.5 py-1 bg-lightBgTertiary dark:bg-darkBgSecondary rounded-xl">
             <Ionicons name="search" size={20} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
						<TextInput
							id={props.id}
							value={value}
							onBlur={onBlur}
							keyboardType={"web-search"}
							onChangeText={onChange}
							placeholder={props.placeholder}
              className="text-lightText dark:text-darkText placeholder:text-lightTextSecondary dark:placeholder:text-darkTextSecondary"
						/>
					</View>
				)
			}}
		>
		</Controller>
	)
}
