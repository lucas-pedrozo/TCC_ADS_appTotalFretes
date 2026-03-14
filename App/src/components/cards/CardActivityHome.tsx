import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";
import { ProgressBarWithPins } from "./ProgressBarWithPins";
import { IconBox } from "@/src/components/ui/IconBox";
import type { FreightUserMap } from "@/src/interfaces/freight";

type CardActivityHomeProps = {
  onPress?: () => void;
  freight: FreightUserMap | null;
  AcceptButton?: boolean;
};


export const CardActivityHome = ({ onPress, freight, AcceptButton = true }: CardActivityHomeProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const iconColor = isDark ? "#FFFFFF" : "#000000";
  const currentStep = freight?.status?.id ?? 0;

  return (
    <>
      {AcceptButton ? (
        <View className="flex-row justify-between items-center pb-2.5 px-2.5">
          <Text className="font-semibold text-lg" style={{ color: colors.text }}>
            {t("CARD.ACTIVITY.MY_ACTIVITY")}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            className="w-10 h-10 rounded-lg items-center justify-center"
            style={{ backgroundColor: colors.bgNonary }}
          >
            <Ionicons name="chevron-forward-outline" size={22} color={iconColor} />
          </TouchableOpacity>
        </View>

      ) : null}

      <TouchableOpacity onPress={onPress} className="flex-1 p-4 rounded-2xl w-full" style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}>
        <View className="flex-1 flex-row items-center gap-3">
          <IconBox name="cube-outline" />
          <View className="flex-1 flex-row justify-between items-center">
            <Text className="font-semibold text-base" style={{ color: colors.text }}>
              {freight?.vehicle_group?.name ?? t("CARD.ACTIVITY.NONE")}
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary}}>
              {freight?.cargo?.name ?? t("CARD.ACTIVITY.NONE")} / {freight?.cargo?.weight ?? t("CARD.ACTIVITY.N_A")}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between pt-3 w-full">
          <Text className="text-sm" style={{ color: colors.text }}>
            {t("CARD.ACTIVITY.ORIGIN")}: {freight?.origin_label ?? t("CARD.ACTIVITY.NONE")}
          </Text>
        </View>
        <View className="flex-row justify-between pt-1 w-full">
          <Text className="text-sm" style={{ color: colors.text }}>
            {t("CARD.ACTIVITY.DESTINATION")}: {freight?.destination_label ?? t("CARD.ACTIVITY.NONE")}
          </Text>
        </View>

        <View className="flex-row justify-between pt-3 w-full">
          <Text className="text-sm" style={{ color: colors.text }}>
            {t("CARD.ACTIVITY.STATUS")}: {freight?.status?.name ?? "---"}
          </Text>
          <Text className="text-sm" style={{ color: colors.text }}>
            {t("CARD.ACTIVITY.DEADLINE")}: {freight?.time_limit ?? "---"}
          </Text>
        </View>

        <ProgressBarWithPins steps={5} currentStep={currentStep} isDark={isDark} />
      </TouchableOpacity >
    </>
  );
};
