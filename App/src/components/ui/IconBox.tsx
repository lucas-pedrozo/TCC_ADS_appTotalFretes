import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIconColor } from "@/src/context/ThemeContext";

type IconBoxProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
};

export function IconBox({ name, size = 26 }: IconBoxProps) {
  const iconColor = useIconColor();

  return (
    <View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
      <Ionicons name={name} size={size} color={iconColor} />
    </View>
  );
}
