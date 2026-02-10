import React from "react"
import { View, Text, TextInput } from "react-native"
import { Controller } from "react-hook-form"

type InputProps = {
	label?: string;
	placeholder?: string;
	type?: "default" | "email-address" | "numeric" | "phone-pad";

	id?: string;
	control: any;
	name: string;
	rules?: object;
}
export const InputDefault = ({ control, name, rules, label, placeholder, type = "default" }: InputProps) => {
	return (
		<Controller
			control={control}
			name={name}
			rules={rules}
			render={() => {
				return (
					<View>
					</View>
				)
			}}
		>
		</Controller>
	)
}