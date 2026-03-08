import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";

type ButtonFilterProps = {
  onPress?: () => void;
};

export const ButtonFilter = ({ onPress }: ButtonFilterProps) => {
  const colors = useThemeColors();
  const iconColor = useIconColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-lg items-center justify-center p-2.5"
      style={{ backgroundColor: colors.bgNonary }}
    >
      <Ionicons name="filter" size={26} color={iconColor} />
    </TouchableOpacity>
  );
};
