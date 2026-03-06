import React from "react";
import { Pressable, Text, View } from "react-native";
import { Controller } from "react-hook-form";

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
    label: "text-lightText dark:text-darkText font-semibold text-base pl-2.5",
    buttonBase: "rounded-lg px-6 py-3 items-center",
    buttonUnselected: "bg-lightBgSecondary dark:bg-darkBgSecondary",
    text: "text-lightText dark:text-darkText font-semibold text-sm",
  },
  selected: {
    button: "bg-green-500",
    text: "text-white",
  },
  error: {
    label: "text-red-500 font-semibold text-base pl-2.5",
  },
};

export const InputGroup = ({ label, name, control, rules, options, wrap = true }: InputButtonGroupProps) => {
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
            <Text className={error ? STYLES_INPUT.error.label : STYLES_INPUT.default.label}> {label}</Text>
            <View className={`flex-row gap-2.5 pt-3 ${wrap ? "flex-wrap" : ""}`}>
              {options.map((option) => {
                const isSelected = selectedValue === option.value;

                const buttonBg = isSelected
                  ? STYLES_INPUT.selected.button
                  : STYLES_INPUT.default.buttonUnselected;
                return (
                  <Pressable
                    key={option.value}
                    className={`${STYLES_INPUT.default.buttonBase} ${buttonBg}`}
                    onPress={() => { onChange(option.value); onBlur(); }}
                  >
                    <Text className={isSelected ? STYLES_INPUT.selected.text : STYLES_INPUT.default.text}>
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
