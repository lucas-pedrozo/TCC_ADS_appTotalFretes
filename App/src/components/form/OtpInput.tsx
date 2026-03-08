import React, { useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { Controller } from "react-hook-form";
import { useThemeColors } from "@/src/context/ThemeContext";
import { onlyDigits } from "./inputs/inputShared";

type OtpInputProps = {
  control: any;
  name: string;
  rules?: object;
  length?: number;
};

export function OtpInput({
  control,
  name,
  rules,
  length = 6,
}: OtpInputProps) {
  const colors = useThemeColors();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const currentValue = value || "";
        const digitsArray = currentValue.split("").slice(0, length);

        while (digitsArray.length < length) {
          digitsArray.push("");
        }

        const handleChange = (text: string, index: number) => {
          const clean = onlyDigits(text);
          const updated = [...digitsArray];
          updated[index] = clean;
          const finalCode = updated.join("").slice(0, length);
          onChange(finalCode);
          if (clean && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
          }
        };

        const handleKeyPress = (key: string, index: number) => {
          if (key === "Backspace" && !digitsArray[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
          }
        };

        return (
          <View>
            <View className="flex-row justify-center gap-2.5 pt-2">
              {digitsArray.map((digit: string, index: number) => (
                <TextInput
                  key={`otp-${index}`}
                  ref={(ref: TextInput | null) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  keyboardType="numeric"
                  textContentType="oneTimeCode"
                  maxLength={1}
                  onChangeText={(text: string) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }: { nativeEvent: { key: string } }) => handleKeyPress(nativeEvent.key, index)}
                  className="w-12 h-12 rounded border text-center text-xl font-semibold"
                  style={{
                    borderColor: error ? "#ef4444" : colors.textSecondary,
                    color: error ? "#ef4444" : colors.text,
                  }}
                />
              ))}
            </View>
            {error && (
              <Text className="text-red-500 text-sm text-center pt-2">
                {error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}
