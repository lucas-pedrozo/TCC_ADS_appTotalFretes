import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useThemeMode } from "@/src/context/ThemeContext";

type ButtonFilterProps = {
  onPress?: () => void;
};

export const ButtonFilter = ({ onPress }: ButtonFilterProps) => {
  const { mode } = useThemeMode();
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-lg bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center p-2.5"
    >
      <Ionicons name="filter" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
    </TouchableOpacity>
  )
}
