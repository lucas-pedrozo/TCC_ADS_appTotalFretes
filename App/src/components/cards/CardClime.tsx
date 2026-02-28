import { Ionicons } from "@expo/vector-icons"
import { useThemeMode } from "@/src/context/ThemeContext"
import { Text, View } from "react-native"

type CardClimeProps = {
  clima?: string;
  cidade?: string;
  temp?: number;
}

export const CardClime = ({ clima, cidade, temp }: CardClimeProps) => {
  const { mode } = useThemeMode();

  return (
    <View className="w-[49%] h-44 rounded-2xl bg-lightBgNonary dark:bg-darkBgNonary p-4">
      <View className="w-12 h-12 rounded-xl bg-lightBgTertiary dark:bg-darkBgTertiary items-center justify-center">
        <Ionicons name="rainy" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
      </View>

      <Text className="text-lightText dark:text-darkText text-sm mt-4">Clima: {clima ?? "-----"}</Text>
      <Text className="text-lightText dark:text-darkText text-sm mt-1">Cidade: {cidade ?? "---"}</Text>
      <Text className="text-lightText dark:text-darkText text-sm mt-1">Temp: {temp ?? "---"}ºC</Text>
    </View>
  )
}