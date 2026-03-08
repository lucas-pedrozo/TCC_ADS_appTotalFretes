import { TouchableOpacity, Text } from "react-native";
import { useThemeColors } from "@/src/context/ThemeContext";

export type ButtonOutlineProps = {
  title: string;
  onPress: () => void;
};

export function ButtonOutline({ title, onPress }: ButtonOutlineProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-24 p-2 rounded-xl"
      style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}
    >
      <Text className="text-center text-sm" style={{ color: colors.text }}>{title}</Text>
    </TouchableOpacity>
  );
}
