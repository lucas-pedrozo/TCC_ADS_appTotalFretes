import React from "react";
import { Pressable, Text, View } from "react-native";
import { Controller } from "react-hook-form";
import { useThemeColors } from "@/src/context/ThemeContext";

type InputOption = {
  label: string;
  value: string;
};

type InputButtonGroupProps = {
  label?: string;
  name: string;
  control: any;
  rules?: object;
  options: InputOption[];
  wrap?: boolean;
};

const STYLES_INPUT = {
  default: {
    label: "font-semibold text-base pl-2.5",
    buttonBase: "rounded-lg px-6 py-3 items-center",
    text: "font-semibold text-sm",
  },
  error: {
    label: "text-red-500 font-semibold text-base pl-2.5",
  },
};

export const InputGroup = ({ label, name, control, rules, options, wrap = true }: InputButtonGroupProps) => {
  const colors = useThemeColors();

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const selectedValue =
          value === undefined || value === null ? "" : String(value);

        return (
          <View>
            <Text
              className={error ? STYLES_INPUT.error.label : STYLES_INPUT.default.label}
              style={error ? undefined : { color: colors.text }}
            >
              {label}
            </Text>
            <View className={`flex-row gap-2.5 pt-3 ${wrap ? "flex-wrap" : ""}`}>
              {options.map((option) => {
                const isSelected = selectedValue === option.value;

                return (
                  <Pressable
                    key={option.value}
                    className={STYLES_INPUT.default.buttonBase}
                    style={{ backgroundColor: isSelected ? "#22c55e" : colors.bgSecondary }}
                    onPress={() => { onChange(option.value); onBlur(); }}
                  >
                    <Text
                      className={STYLES_INPUT.default.text}
                      style={{ color: isSelected ? "#FFFFFF" : colors.text }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {error ? <Text className="text-red-500 text-sm pl-2.5 pt-1">{error.message}</Text> : null}
          </View>
        );
      }}
    />
  );
};
