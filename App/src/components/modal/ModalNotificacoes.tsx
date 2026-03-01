import React from "react";
import { Modal, Text, TouchableOpacity, View, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeMode } from "@/src/context/ThemeContext";
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
      />
      <animation.appleModal
        className="flex-1 justify-end"
      >
        <View className="bg-lightBg dark:bg-darkBg rounded-t-2xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lightText dark:text-darkText font-semibold text-lg">Notificações</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="mb-4 p-3 bg-lightBgSecondary dark:bg-darkBgSecondary rounded-xl">
                <Text className="text-lightText dark:text-darkText font-medium text-base">{item.title}</Text>
                <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-sm mt-1">{item.message}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-center mt-4">
                Nenhuma notificação disponível.
              </Text>
            }
          />
        </View>
      </animation.appleModal>
    </Modal>
  );
};

export default ModalNotificacoes;