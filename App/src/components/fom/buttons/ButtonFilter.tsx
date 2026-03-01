import { TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useThemeMode } from "@/src/context/ThemeContext";

export const ButtonFilter = () => {
  const { mode } = useThemeMode();
  return (
    <TouchableOpacity className="rounded-lg bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center p-2.5">
      <Ionicons name="filter" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
    </TouchableOpacity>
  )
}