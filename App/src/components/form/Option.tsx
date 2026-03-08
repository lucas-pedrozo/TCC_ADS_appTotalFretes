import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { IconBox } from "@/src/components/ui/IconBox";

type OptionProps = {
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export function Option({ title, icon, onPress }: OptionProps) {
  const colors = useThemeColors();
  const iconColor = useIconColor();

  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between">
      <View className="flex-row items-center justify-center gap-2.5">
        {icon && <IconBox name={icon} />}
        <Text className="font-semibold text-base" style={{ color: colors.text }}>{title}</Text>
      </View>

      <Ionicons name="chevron-forward-outline" size={22} color={iconColor} />
    </TouchableOpacity>
  );
}
