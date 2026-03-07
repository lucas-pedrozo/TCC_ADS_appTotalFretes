import React from "react";
import { Controller } from "react-hook-form";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIconColor } from "@/src/context/ThemeContext";

type InputProps = {
  label?: string;
  placeholder?: string;
  id?: string;
  control: any;
  name: string;
  rules?: object;
};

export const InputSearch = ({ control, name, rules, id, placeholder }: InputProps) => {
  const iconColor = useIconColor();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="flex-1 flex-row items-center px-2.5 py-1 bg-lightBgSecondary dark:bg-darkBgSecondary rounded-xl">
          <Ionicons name="search" size={20} color={iconColor} />
          <TextInput
            id={id}
            value={value}
            onBlur={onBlur}
            keyboardType="web-search"
            onChangeText={onChange}
            placeholder={placeholder}
            className="text-lightText dark:text-darkText placeholder:text-lightTextSecondary dark:placeholder:text-darkTextSecondary flex-1"
          />
        </View>
      )}
    />
  );
};
