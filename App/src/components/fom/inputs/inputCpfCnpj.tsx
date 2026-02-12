import React from "react"
import { View, Text, TextInput } from "react-native"
import { Controller } from "react-hook-form"

import { maskCpf } from "@/src/utils/formMask"

type InputProps = {
	label?: string;
	placeholder?: string;
	secureTextEntry?: boolean;

	id?: string;
	control: any;
	name: string;
	rules?: object;
}

const STYLES_INPUT = {
	default: {
		label: `text-lightText dark:text-darkText font-semibold text-base pl-2.5`,
		input: `bg-lightBgSecondary dark:bg-darkBgSecondary rounded-lg p-2.5 font-semibold text-base placeholder:text-white/60 text-darkText`,
	},
	error: {
		label: `text-red-500 font-semibold text-base pl-2.5`,
		input: `bg-lightBgSecondary dark:bg-darkBgSecondary rounded-lg p-2.5 font-semibold text-base placeholder:text-red-500 dark:placeholder:text-red-500 text-red-500`,
	}
}

export const InputCpfCnpj = ({ id, control, name, rules, label, placeholder, secureTextEntry }: InputProps) => {
	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			render={({
				field: { onChange, onBlur, value },
				fieldState: { error }
			}) => {
				return (
					<View>
						{label ? <Text className={error ? STYLES_INPUT.error.label : STYLES_INPUT.default.label}>{label}</Text> : null}
						<TextInput
							id={id}
							placeholder={placeholder}
							keyboardType="numeric"
							secureTextEntry={secureTextEntry}
							onChangeText={(text) => onChange(maskCpf(text))}
							onBlur={onBlur}
							value={value}
							className={`${error ? STYLES_INPUT.error.input : STYLES_INPUT.default.input}`}
						/>
						{error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
					</View>
				)
			}}
		>
		</Controller>
	)
}