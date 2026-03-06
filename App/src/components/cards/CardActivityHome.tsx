import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/context/AuthContext";
import { useThemeMode } from "@/src/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native"
import { ProgressBarWithPins } from "./ProgressBarWithPins";
import { useHookGetFreightUser } from "@/src/hooks/freight/hookGetFreightUser"; 

type CardActivityHomeProps = {
  navegation: () => void;
}

export const CardActivityHome = ({ navegation }: CardActivityHomeProps) => {
  const { id } = useAuth()
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const { freightUser, handleGetFreightUser } = useHookGetFreightUser();

  useEffect(() => {
    if (id) {
      handleGetFreightUser(String(id));
    }
  }, [id, handleGetFreightUser]);
    
  return (
    <>
      <View className="flex-row justify-between items-center pt-6 pb-2.5 px-0.5">
        <Text className="text-lightText dark:text-darkText font-semibold text-lg">{t("CARD.ACTIVITY.MY_ACTIVITY")}</Text>

        <TouchableOpacity onPress={navegation} className="w-10 h-10 rounded-lg bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
          <Ionicons name="chevron-forward-outline" size={22} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={navegation} className="p-4 bg-lightBgNonary dark:bg-darkBgNonary rounded-2xl w-full border border-lightBgTertiary dark:border-darkBgTertiary">
       
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
            <Ionicons name="cube-outline" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
          </View>
          <Text className="text-lightText dark:text-darkText font-semibold text-base">{t("COMMON.NOTINFORMED")}</Text>
        </View>

        <View className="flex-row justify-between pt-3 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">{t("CARD.ACTIVITY.ORIGIN")}: {freightUser?.origin_label ?? t("COMMON.NOTINFORMED")}</Text>
          <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-sm">{t("CARD.ACTIVITY.NONE_NA")}</Text>
        </View>
        <View className="flex-row justify-between pt-1 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">{t("CARD.ACTIVITY.DESTINATION")}: {freightUser?.destination_label ?? t("COMMON.NOTINFORMED")}</Text>
        </View>

        <View className="flex-row justify-between pt-3 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">{t("CARD.ACTIVITY.STATUS")}: {freightUser?.status ?? "---"}</Text>
          <Text className="text-lightText dark:text-darkText text-sm">{t("CARD.ACTIVITY.DEADLINE")}: {freightUser?.time_limit ?? "----"}</Text>
        </View>

        <ProgressBarWithPins steps={5} currentStep={0} isDark={mode === "dark"} />

      </TouchableOpacity>
    </>
  )
} 