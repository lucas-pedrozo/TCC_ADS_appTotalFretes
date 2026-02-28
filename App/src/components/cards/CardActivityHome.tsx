import { Ionicons } from "@expo/vector-icons"
import { useThemeMode } from "@/src/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native"
import { ProgressBarWithPins } from "./ProgressBarWithPins";


export const CardActivityHome = () => {
  const { mode } = useThemeMode();

  return (
    <>
      <View className="flex-row justify-between items-center pt-6 pb-2.5 px-0.5">
        <Text className="text-lightText dark:text-darkText font-semibold text-lg">Minha atividade Atual</Text>

        <TouchableOpacity className="w-10 h-10 rounded-lg bg-lightBgTertiary dark:bg-darkBgTertiary items-center justify-center">
          <Ionicons name="chevron-forward-outline" size={22} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="p-4 bg-lightBgNonary dark:bg-darkBgNonary rounded-2xl w-full border border-lightBgTertiary dark:border-darkBgTertiary">
       
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-xl bg-lightBgTertiary dark:bg-darkBgTertiary items-center justify-center">
            <Ionicons name="cube-outline" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
          </View>
          <Text className="text-lightText dark:text-darkText font-semibold text-base">Reboque Caçamba</Text>
        </View>

        <View className="flex-row justify-between pt-3 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">Início: Sem local</Text>
          <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-sm">Cascalho / 20T</Text>
        </View>
        <View className="flex-row justify-between pt-1 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">Destino: Sem destino</Text>
        </View>

        <View className="flex-row justify-between pt-3 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">Status: Nenhum</Text>
          <Text className="text-lightText dark:text-darkText text-sm">Prazo: -----</Text>
        </View>

        <ProgressBarWithPins steps={5} currentStep={0} isDark={mode === "dark"} />

      </TouchableOpacity>
    </>
  )
}