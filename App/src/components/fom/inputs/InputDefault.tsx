import React from "react"
import { Controller } from "react-hook-form"
import { maskCpf, maskDate, maskPhone } from "@/src/utils/formMask";
import { View, Text, TextInput } from "react-native"

type InputProps = {
	label?: string;
	placeholder?: string;
	type?: "default" | "email-address" | "numeric" | "phone-pad";
	secureTextEntry?: boolean;
	maxLength?: number;
	desabled?: boolean;

	id?: string;
	control: any;
	name: string;
	rules?: object;
}

const onlyDigits = (text: string) => text.replace(/\D/g, "")

const STYLES_INPUT = {
	default: {
		label: `text-lightText dark:text-darkText font-semibold text-base pl-2.5`,
		input: `bg-lightBgSecondary dark:bg-darkBgSecondary rounded-lg px-2.5 py-3 font-semibold text-base placeholder:text-lightTextSecondary dark:placeholder:text-darkTextSecondary text-lightText dark:text-darkText`,
	},
	error: {
		label: `text-red-500 font-semibold text-base pl-2.5`,
		input: `bg-lightBgSecondary dark:bg-darkBgSecondary rounded-lg px-2.5 py-3 font-semibold text-base placeholder:text-red-500 dark:placeholder:text-red-500 text-red-500`,
	},
	desabled: {
		label: `text-lightText dark:text-darkText font-semibold text-base pl-2.5 opacity-70`,
		input: `bg-lightBgSecondary dark:bg-darkBgSecondary rounded-lg px-2.5 py-3 font-semibold text-base placeholder:text-lightTextSecondary dark:placeholder:text-darkTextSecondary text-lightText dark:text-darkText opacity-70`,
	}
}

export const InputDefault = ({ id, control, name, rules, label, placeholder, type, secureTextEntry, maxLength, desabled = false }: InputProps) => {
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
						{label ? <Text className={error ? STYLES_INPUT.error.label : desabled ? STYLES_INPUT.desabled.label : STYLES_INPUT.default.label}>{label}</Text> : null}
						<TextInput
							id={id}
							onBlur={onBlur}
							keyboardType={type}
							maxLength={maxLength}
							value={String(value ?? "")}
							onChangeText={onChange}
							placeholder={placeholder}
							secureTextEntry={secureTextEntry}
							editable={!desabled}
							className={`${error ? STYLES_INPUT.error.input : desabled ? STYLES_INPUT.desabled.input : STYLES_INPUT.default.input}`}
						/>
						{error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
					</View>
				)
			}}
		>
		</Controller>
	)
}

export const InputCpf = ({ id, control, name, rules, label, placeholder, secureTextEntry, maxLength, desabled }: InputProps) => {
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
						{label ? <Text className={error ? STYLES_INPUT.error.label : desabled ? STYLES_INPUT.desabled.label : STYLES_INPUT.default.label}>{label}</Text> : null}
						<TextInput
							id={id}
							onBlur={onBlur}
							maxLength={maxLength}
							keyboardType="numeric"
							placeholder={placeholder}
							secureTextEntry={secureTextEntry}
							value={maskCpf(String(value ?? ""))}
							editable={!desabled}
							onChangeText={(text) => onChange(onlyDigits(text))}
							className={`${error ? STYLES_INPUT.error.input : desabled ? STYLES_INPUT.desabled.input : STYLES_INPUT.default.input}`}
						/>
						{error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
					</View>
				)
			}}
		>
		</Controller>
	)
}

export const InputDate = ({ id, control, name, rules, label, placeholder, secureTextEntry, maxLength }: InputProps) => {
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
                            value={maskDate(String(value ?? ""))}
                            onBlur={onBlur}
                            keyboardType="numeric"
                            maxLength={maxLength}
                            onChangeText={(text) => onChange(onlyDigits(text))}
                            placeholder={placeholder ?? "dd/mm/aaaa"}
                            secureTextEntry={secureTextEntry}
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


export const InputPhone = ({ id, control, name, rules, label, placeholder, secureTextEntry, maxLength }: InputProps) => {
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
							onBlur={onBlur}
							maxLength={maxLength}
							keyboardType="phone-pad"
							placeholder={placeholder}
							secureTextEntry={secureTextEntry}
							value={maskPhone(String(value ?? ""))}
							onChangeText={(text) => onChange(onlyDigits(text))}
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
