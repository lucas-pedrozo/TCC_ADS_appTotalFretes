import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useDeleteUser } from "@/src/hooks/user/useDeleteUser";
import { ButtonCancel } from "@/src/components/form";

const CancelAccount = () => {
  const { t } = useTranslation();
  const { handleDeleteUser, isdisabled } = useDeleteUser();

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30 }} className="bg-lightBg dark:bg-darkBg">
      <Text className="text-lightText dark:text-darkText text-base font-medium">{t("CANCELACCOUNT.DESCRIPTION")}</Text>
      <View className="flex-1">
        <ButtonCancel title={t("CANCELACCOUNT.CONFIRM")} onPress={handleDeleteUser} disabled={isdisabled} />
      </View>
    </View>
  )
}

export default CancelAccount;