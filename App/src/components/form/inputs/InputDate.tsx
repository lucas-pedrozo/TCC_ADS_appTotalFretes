import React from "react";
import { Controller } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

import { maskDate } from "@/src/utils/formMask";

import { INPUT_STYLES, onlyDigits, type InputBaseProps } from "./inputShared";

export function InputDate({
  id,
  control,
  name,
  rules,
  label,
  placeholder,
  secureTextEntry,
  maxLength,
}: InputBaseProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View>
          {label ? (
            <Text className={error ? INPUT_STYLES.error.label : INPUT_STYLES.default.label}>{label}</Text>
          ) : null}
          <TextInput
            id={id}
            value={maskDate(String(value ?? ""))}
            onBlur={onBlur}
            keyboardType="numeric"
            maxLength={maxLength}
            onChangeText={(text) => onChange(onlyDigits(text))}
            placeholder={placeholder ?? "dd/mm/aaaa"}
            secureTextEntry={secureTextEntry}
            className={error ? INPUT_STYLES.error.input : INPUT_STYLES.default.input}
          />
          {error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
        </View>
      )}
    />
  );
}
