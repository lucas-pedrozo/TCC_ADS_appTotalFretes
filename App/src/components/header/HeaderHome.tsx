import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatName } from "@/src/utils/format";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
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
  const colors = useThemeColors();
  const iconColor = useIconColor();

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
          {userData?.userImage_id ? (
            <Image source={{ uri: `/user/image/${userData.userImage_id}` }} className="w-14 h-14 rounded-xl" />
          ) : (
            <View className="w-14 h-14 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
              <Ionicons name="person-outline" size={24} color={iconColor} />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-col">
          <Text className="font-medium text-sm" style={{ color: colors.textSecondary }}>
            {greeting}
          </Text>
          <Text className="font-semibold text-base" style={{ color: colors.text }}>
            {formatName(userData?.name ?? notInformedLabel)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2.5">
        <TouchableOpacity
          onPress={onNotificationsPress}
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: colors.bgNonary }}
        >
          <Ionicons name="notifications-outline" size={24} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLogout}
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: colors.bgNonary }}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
