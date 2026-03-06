import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatName } from "@/src/utils/format";
import { useThemeMode } from "@/src/context/ThemeContext";
import type { MapUser } from "@/src/interfaces/user";

export type HeaderHomeProps = {
  userData?: MapUser | null;
  greeting: string;
  notInformedLabel: string;
  onProfilePress: () => void;
  onNotificationsPress: () => void;
  onLogout: () => void;
};

export function HeaderHome({
  userData,
  greeting,
  notInformedLabel,
  onProfilePress,
  onNotificationsPress,
  onLogout,
}: HeaderHomeProps) {
  const { mode } = useThemeMode();

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
          {userData?.userImage_id ? (
            <Image source={require("@/src/assets/usuario.jpg")} className="w-14 h-14 rounded-xl" />
          ) : (
            <View className="w-14 h-14 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
              <Ionicons name="person-outline" size={24} color={mode === "dark" ? "white" : "black"} />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-col">
          <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-medium text-sm">
            {greeting}
          </Text>
          <Text className="text-lightText dark:text-darkText font-semibold text-base">
            {formatName(userData?.name ?? notInformedLabel)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2.5">
        <TouchableOpacity
          onPress={onNotificationsPress}
          className="bg-lightBgNonary dark:bg-darkBgNonary p-2.5 rounded-xl"
        >
          <Ionicons name="notifications-outline" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLogout}
          className="bg-lightBgNonary dark:bg-darkBgNonary p-2.5 rounded-xl"
        >
          <Ionicons name="log-out-outline" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
