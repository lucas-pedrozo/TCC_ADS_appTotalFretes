import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useIconColor } from "@/src/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";
import { formatNameSobrenome } from "@/src/utils/format";
import { IconBox } from "@/src/components/ui/IconBox";

type CardHistoryProps = {
  onPress?: () => void;
};

export const CardHistory = ({ onPress }: CardHistoryProps) => {
  const { t } = useTranslation();
  const iconColor = useIconColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 w-[220px] min-h-[140px] rounded-2xl bg-lightBgNonary dark:bg-darkBgNonary p-4 border border-lightBgTertiary dark:border-darkBgTertiary"
    >
      <View className="flex-row justify-between">
        <IconBox name="list-outline" />
        <Feather name="arrow-up-right" size={24} color={iconColor} />
      </View>

      <Text className="text-lightText dark:text-darkText text-sm mt-4">
        Ver Histórico
      </Text>
      <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-sm mt-1">
        Veja quais fretes voce Já aceitou ou cancelou
      </Text>
    </TouchableOpacity>
  );
};
