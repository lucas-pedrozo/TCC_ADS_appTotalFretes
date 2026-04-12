import { Image, Text, TouchableOpacity, View } from "react-native";

import { ENV_BASE_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import { formatName } from "@/src/utils/format";
import type { MapUser } from "@/src/interfaces/user";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";

export type HeaderHomeProps = {
  greeting: string;
  userData?: MapUser | null;
  notInformedLabel: string;
  onLogout: () => void;
  onProfilePress: () => void;
  onNotificationsPress: () => void;
};

export const HeaderHome = ({ userData, greeting, notInformedLabel, onProfilePress, onNotificationsPress, onLogout }: HeaderHomeProps) => {
  const colors = useThemeColors();
  const iconColor = useIconColor();
  const profileImageUrl = userData?.UserImage?.path ? `${ENV_BASE_URL}${userData.UserImage.path}` : undefined;

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={onProfilePress}>
          {profileImageUrl ? (
            <Image source={{ uri: profileImageUrl }} className="w-14 h-14 rounded-xl" />
          ) : (
            <View className="w-14 h-14 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
              <Ionicons name="person-outline" size={24} color={iconColor} />
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-col">
          <Text className="font-medium text-sm" style={{ color: colors.textSecondary }}>{greeting}</Text>
          <Text className="font-semibold text-base " style={{ color: colors.text }}>{formatName(userData?.name ?? notInformedLabel)}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2.5">
        <TouchableOpacity onPress={onNotificationsPress} className="p-2.5 rounded-xl" style={{ backgroundColor: colors.bgNonary }}>
          <Ionicons name="notifications-outline" size={24} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} className="p-2.5 rounded-xl" style={{ backgroundColor: colors.bgNonary }}>
          <Ionicons name="log-out-outline" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
