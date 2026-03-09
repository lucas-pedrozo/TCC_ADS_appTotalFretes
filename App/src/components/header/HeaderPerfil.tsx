import { useState } from "react";
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { formatNameSobrenome, maskCpfUltimosCinco } from "@/src/utils/format";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type HeaderPerfilProps = {
  name?: string;
  image?: string;
  email?: string;
  cpf?: string;
};

export const HeaderPerfil = ({ name, image, email, cpf }: HeaderPerfilProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const colors = useThemeColors();
  const iconColor = useIconColor();
  const formattedName = formatNameSobrenome(name ?? "");

  return (
    <>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <Pressable className="absolute inset-0" onPress={() => setIsModalVisible(false)} />

          <View
            className="w-full max-w-[340px] rounded-2xl p-5 items-center"
            style={{ backgroundColor: colors.bgSecondary, borderWidth: 1, borderColor: colors.bgTertiary }}
          >
            <TouchableOpacity
              className="absolute right-3 top-3 p-1"
              onPress={() => setIsModalVisible(false)}
              accessibilityLabel="Fechar modal de perfil"
            >
              <Ionicons name="close" size={24} color={iconColor} />
            </TouchableOpacity>

            {image ? (
              <Image source={{ uri: image }} className="w-[180px] h-[180px] rounded-full" />
            ) : (
              <View
                className="w-[180px] h-[180px] rounded-full items-center justify-center"
                style={{ backgroundColor: colors.bgNonary }}
              >
                <Ionicons name="person-outline" size={82} color={iconColor} />
              </View>
            )}

            <Text className="mt-4 text-xl font-semibold text-center" style={{ color: colors.text }}>
              {formattedName || "Usuário"}
            </Text>
          </View>
        </View>
      </Modal>

      <View className="flex-row">
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Abrir foto do perfil"
        >
          {image ? (
            <Image source={{ uri: image }} className="w-[100px] h-[100px] rounded-full" />
          ) : (
            <View
              className="w-[100px] h-[100px] rounded-full items-center justify-center"
              style={{ backgroundColor: colors.bgNonary }}
            >
              <Ionicons name="person-outline" size={40} color={iconColor} />
            </View>
          )}
        </TouchableOpacity>

      <View className="ml-4 justify-center">
        <Text className="text-lg font-semibold" style={{ color: colors.text }}>{formattedName}</Text>
        <Text className="text-sm font-semibold" style={{ color: colors.textSeptenary }}>{email}</Text>
        <Text className="text-sm font-semibold" style={{ color: colors.textSeptenary }}>
          {maskCpfUltimosCinco(String(cpf ?? ""))}
        </Text>
      </View>
      </View>
    </>
  );
};
