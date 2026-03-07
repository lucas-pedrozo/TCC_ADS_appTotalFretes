import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIconColor } from "@/src/context/ThemeContext";

type ButtonFilterProps = {
  onPress?: () => void;
};

export const ButtonFilter = ({ onPress }: ButtonFilterProps) => {
  const iconColor = useIconColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-lg bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center p-2.5"
    >
      <Ionicons name="filter" size={26} color={iconColor} />
    </TouchableOpacity>
  );
};
