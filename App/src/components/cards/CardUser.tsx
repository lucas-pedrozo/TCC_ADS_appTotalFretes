import { Ionicons } from "@expo/vector-icons"
import { useThemeMode } from "@/src/context/ThemeContext"
import { Text, TouchableOpacity, View } from "react-native"

type CardUserProps = {
  name?: string;
  cnhType?: string;
  navegation?: () => void;
}

export const CardUser = ({ name, cnhType, navegation }: CardUserProps) => {
  const { mode } = useThemeMode();
  

  return (
    <TouchableOpacity onPress={navegation} className="flex-1 min-h-[140px] rounded-2xl bg-lightBgNonary dark:bg-darkBgNonary p-4 border border-lightBgTertiary dark:border-darkBgTertiary">
      <View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
        <Ionicons name="person" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
      </View>

      <Text className="text-lightText dark:text-darkText text-sm mt-4">Nome: {name ?? "Não informado"}</Text>
      <Text className="text-lightText dark:text-darkText text-sm mt-1">Categoria: {cnhType ?? "Não informado"}</Text>
    </TouchableOpacity>
  )
}