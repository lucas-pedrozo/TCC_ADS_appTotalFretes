import React from "react";
import { Controller } from "react-hook-form";
import { View, Text, TextInput } from "react-native";

import { INPUT_STYLES, type InputBaseProps } from "./inputShared";

export function InputDefault({
  id,
  control,
  name,
  rules,
  label,
  placeholder,
  type,
  secureTextEntry,
  maxLength,
  desabled = false,
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
                error ? INPUT_STYLES.error.label : desabled ? INPUT_STYLES.desabled.label : INPUT_STYLES.default.label
              }
            >
              {label}
            </Text>
          ) : null}
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
            className={
              error ? INPUT_STYLES.error.input : desabled ? INPUT_STYLES.desabled.input : INPUT_STYLES.default.input
            }
          />
          {error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
        </View>
      )}
    />
  );
}
