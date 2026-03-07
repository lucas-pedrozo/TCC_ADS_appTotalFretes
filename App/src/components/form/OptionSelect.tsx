import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useIconColor } from "@/src/context/ThemeContext";
import { IconBox } from "@/src/components/ui/IconBox";
import animation from "@/src/utils/animation";

export type OptionSelectOption = {
  value: string;
  label: string;
};

type OptionSelectProps = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  options: OptionSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
};

export function OptionSelect({ title, icon, options, value, onValueChange }: OptionSelectProps) {
  const iconColor = useIconColor();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === value) ?? options[0];

  return (
    <>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center justify-center gap-2.5">
          {icon && <IconBox name={icon} />}
          <Text className="text-lightText dark:text-darkText font-semibold text-base">{title}</Text>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-row items-center gap-1.5">
          <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-medium text-sm">
            {selectedOption.label}
          </Text>
          <Ionicons name="chevron-down" size={20} color={iconColor} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setModalVisible(false)}
        >
          <animation.FadeDown
            className="mx-4 rounded-2xl overflow-hidden bg-lightBgSecondary dark:bg-darkBgSecondary"
            onStartShouldSetResponder={() => true}
          >
            <View className="max-h-80 py-2">
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onValueChange(opt.value);
                    setModalVisible(false);
                  }}
                  className="py-3.5 px-4 active:opacity-70"
                >
                  <Text
                    className={`text-base font-medium ${opt.value === value
                      ? "text-darkBgOctonary dark:text-lightBgOctonary"
                      : "text-lightText dark:text-darkText"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </animation.FadeDown>
        </Pressable>
      </Modal>
    </>
  );
}
