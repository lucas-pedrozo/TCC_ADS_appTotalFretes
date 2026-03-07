import React from "react";
import { Controller } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

import { maskCpf } from "@/src/utils/formMask";

import { INPUT_STYLES, onlyDigits, type InputBaseProps } from "./inputShared";

export function InputCpf({
  id,
  control,
  name,
  rules,
  label,
  placeholder,
  secureTextEntry,
  maxLength,
  disabled,
}: InputBaseProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View>
          {label ? (
            <Text
              className={
                error ? INPUT_STYLES.error.label : disabled ? INPUT_STYLES.disabled.label : INPUT_STYLES.default.label
              }
            >
              {label}
            </Text>
          ) : null}
          <TextInput
            id={id}
            onBlur={onBlur}
            maxLength={maxLength}
            keyboardType="numeric"
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            value={maskCpf(String(value ?? ""))}
            editable={!disabled}
            onChangeText={(text) => onChange(onlyDigits(text))}
            className={
              error ? INPUT_STYLES.error.input : disabled ? INPUT_STYLES.disabled.input : INPUT_STYLES.default.input
            }
          />
          {error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
        </View>
      )}
    />
  );
}
