import React from "react";
import { Modal, Text, TouchableOpacity, View, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import animation from "@/src/utils/animation";

interface Notification {
  id: number;
  title: string;
  message: string;
}

interface ModalNotificacoesProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const ModalNotificacoes = ({ visible, onClose, notifications }: ModalNotificacoesProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { mode } = useThemeMode();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50"
      >
      
      <animation.appleModal
        className="flex-1 justify-end"
      >
        <View className="rounded-t-2xl p-4" style={{ backgroundColor: colors.bg }}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-semibold text-lg" style={{ color: colors.text }}>{t("MODALNOTIFICACOES.TITLE")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="mb-4 p-3 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                <Text className="font-medium text-base" style={{ color: colors.text }}>{item.title}</Text>
                <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>{item.message}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center mt-4" style={{ color: colors.textSecondary }}>
                {t("MODALNOTIFICACOES.EMPTY")}
              </Text>
            }
          />
        </View>
      </animation.appleModal>
      </Pressable>
    </Modal>
  );
};

export default ModalNotificacoes;