import { Text, View } from "react-native";
import { useThemeColors } from "@/src/context/ThemeContext";

type DetailRowProps = {
  label: string;
  value: string | number;
}

export const DetailRow = ({ label, value }: DetailRowProps) => {
  const colors = useThemeColors();

  return (
    <View className="flex-row gap-2.5 mb-2.5">
      <Text style={{ color: colors.textSecondary }}>
        {label}: <Text style={{ color: colors.text }}>{value}</Text>
      </Text>
    </View>
  );
}