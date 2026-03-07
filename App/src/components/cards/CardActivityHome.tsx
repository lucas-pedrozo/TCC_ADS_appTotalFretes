import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useThemeMode } from "@/src/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";
import { ProgressBarWithPins } from "./ProgressBarWithPins";
import { IconBox } from "@/src/components/ui/IconBox";
import type { FreightUserMap } from "@/src/interfaces/freight";

type CardActivityHomeProps = {
  onPress?: () => void;
  freight: FreightUserMap | null;
  AcceptButton?: boolean;
};

const STATUS_STEP_MAP: Record<string, number> = {
  pending: 1,
  accepted: 2,
  in_transit: 3,
  delivered: 4,
  completed: 5,
};

export const CardActivityHome = ({ onPress, freight, AcceptButton = true }: CardActivityHomeProps) => {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const iconColor = isDark ? "#FFFFFF" : "#000000";
  const currentStep = STATUS_STEP_MAP[freight?.status ?? ""] ?? 0;

  return (
    <>
      {AcceptButton ? (
        <View className="flex-row justify-between items-center pb-2.5 px-2.5">
          <Text className="text-lightText dark:text-darkText font-semibold text-lg">
            {t("CARD.ACTIVITY.MY_ACTIVITY")}
          </Text>

          <TouchableOpacity
            onPress={onPress}
            className="w-10 h-10 rounded-lg bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center"
          >
            <Ionicons name="chevron-forward-outline" size={22} color={iconColor} />
          </TouchableOpacity>
        </View>

      ) : null}

      <TouchableOpacity onPress={onPress} className="flex-1 p-4 bg-lightBgNonary dark:bg-darkBgNonary rounded-2xl w-full border border-lightBgTertiary dark:border-darkBgTertiary">
        <View className="flex-1 flex-row items-center gap-3">
          <IconBox name="cube-outline" />
          <View className="flex-1 flex-row justify-between items-center">
            <Text className="text-lightText dark:text-darkText font-semibold text-base">
              {freight?.title || t("CARD.ACTIVITY.NONE")}
            </Text>
            <Text className="text-lightText dark:text-darkText text-sm">
              {freight?.cargo?.name ?? t("CARD.ACTIVITY.NONE")} / {freight?.cargo?.weight ?? t("CARD.ACTIVITY.N_A")}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between pt-3 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">
            {t("CARD.ACTIVITY.ORIGIN")}: {freight?.origin_label ?? t("CARD.ACTIVITY.NONE")}
          </Text>
        </View>
        <View className="flex-row justify-between pt-1 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">
            {t("CARD.ACTIVITY.DESTINATION")}: {freight?.destination_label ?? t("CARD.ACTIVITY.NONE")}
          </Text>
        </View>

        <View className="flex-row justify-between pt-3 w-full">
          <Text className="text-lightText dark:text-darkText text-sm">
            {t("CARD.ACTIVITY.STATUS")}: {freight?.status ?? "---"}
          </Text>
          <Text className="text-lightText dark:text-darkText text-sm">
            {t("CARD.ACTIVITY.DEADLINE")}: {freight?.time_limit ?? "---"}
          </Text>
        </View>

        <ProgressBarWithPins steps={5} currentStep={currentStep} isDark={isDark} />
      </TouchableOpacity >
    </>
  );
};
