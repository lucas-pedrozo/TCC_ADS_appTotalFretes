import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useThemeMode } from "@/src/context/ThemeContext";

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

export const OptionSelect = (props: OptionSelectProps) => {
  const { mode } = useThemeMode();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption =
    props.options.find((o) => o.value === props.value) ?? props.options[0];

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} className="flex-row items-center justify-between">
        <View className="flex-row items-center justify-center gap-2.5">
          <View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
            <Ionicons name={props.icon} size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
          </View>
          <Text className="text-lightText dark:text-darkText font-semibold text-base">{props.title}</Text>
        </View>

        <View className="flex-row items-center gap-1.5">
          <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-medium text-sm">
            {selectedOption.label}
          </Text>
          <Ionicons name="chevron-down" size={20} color={mode === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"} />
        </View>
      </TouchableOpacity>

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
          <View
            className="mx-4 rounded-2xl overflow-hidden bg-lightBgTertiary dark:bg-darkBgSecondary"
            onStartShouldSetResponder={() => true}
          >
            <View className="max-h-80 py-2">
              {props.options.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    props.onValueChange(opt.value);
                    setModalVisible(false);
                  }}
                  className="py-3.5 px-4 active:opacity-70"
                >
                  <Text
                    className={`text-base font-medium ${opt.value === props.value
                      ? "text-darkBgOctonary dark:text-lightBgOctonary"
                      : "text-lightText dark:text-darkText"
                      }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
