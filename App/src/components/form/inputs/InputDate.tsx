import React from "react";
import { Controller } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

import { useThemeColors } from "@/src/context/ThemeContext";
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
  const colors = useThemeColors();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const inputStyle = error
          ? { backgroundColor: colors.bgSecondary, color: colors.textQuinary }
          : { backgroundColor: colors.bgNonary, color: colors.text };
        const placeholderColor = error ? colors.textQuinary : colors.textSecondary;

        return (
          <View>
            {label ? (
              <Text
                className={error ? INPUT_STYLES.error.label : INPUT_STYLES.default.label}
                style={error ? { color: colors.textQuinary } : { color: colors.text }}
              >
                {label}
              </Text>
            ) : null}
            <TextInput
              id={id}
              value={maskDate(String(value ?? ""))}
              onBlur={onBlur}
              keyboardType="numeric"
              maxLength={maxLength}
              onChangeText={(text) => onChange(onlyDigits(text))}
              placeholder={placeholder ?? "dd/mm/aaaa"}
              placeholderTextColor={placeholderColor}
              secureTextEntry={secureTextEntry}
              style={inputStyle}
              className={error ? INPUT_STYLES.error.input : INPUT_STYLES.default.input}
            />
            {error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
          </View>
        );
      }}
    />
  );
}
