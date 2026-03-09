import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useDeleteUser } from "@/src/hooks/user/useCancelAccount";
import { ButtonCancel } from "@/src/components/form";
import { useThemeColors } from "@/src/context/ThemeContext";

const CancelAccount = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { handleDeleteUser, isdisabled } = useDeleteUser();

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30, backgroundColor: colors.bg }}>
      <Text className="text-base font-medium" style={{ color: colors.text }}>{t("CANCELACCOUNT.DESCRIPTION")}</Text>
      <View className="pt-10">
        <ButtonCancel title={t("CANCELACCOUNT.CONFIRM")} onPress={handleDeleteUser} disabled={!isdisabled} />
      </View>
    </View>
  )
}

export default CancelAccount;
