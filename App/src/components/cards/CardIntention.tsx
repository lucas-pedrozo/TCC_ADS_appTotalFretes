import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";
import { formatNameSobrenome } from "@/src/utils/format";
import { IconBox } from "@/src/components/ui/IconBox";

type CardIntentionProps = {
  onPress?: () => void;
};

export const CardIntention = ({ onPress }: CardIntentionProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const iconColor = useIconColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 w-[220px] min-h-[140px] rounded-2xl p-4"
      style={{ backgroundColor: colors.bgNonary, borderColor: colors.bgTertiary, borderWidth: 1 }}
    >
      <View className="flex-row justify-between">
        <IconBox name="list-outline" />
        <Feather name="arrow-up-right" size={24} color={iconColor} />
      </View>

      <Text className="text-sm mt-4" style={{ color: colors.text }}>
        Ver Propostas
      </Text>
      <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
        Veja quais fretes voce deseja aceitar ou cancelar
      </Text>
    </TouchableOpacity>
  );
};
