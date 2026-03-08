import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";

type IconBoxProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
};

export function IconBox({ name, size = 26 }: IconBoxProps) {
  const colors = useThemeColors();
  const iconColor = useIconColor();

  return (
    <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
      <Ionicons name={name} size={size} color={iconColor} />
    </View>
  );
}
