import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Option } from "@/src/components/form";
import { useNavigation } from "@react-navigation/native"; 
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";

const AdvancedOptions = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goToRenewPassword = () => {
    navigation.navigate("RenewPassword");
  }


  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 10 }} className="bg-lightBg dark:bg-darkBg">
      <View className="flex-col gap-2.5">
        <Option title={t("ADVANCEDOPTIONS.RESETPASSWORD")} icon="lock-closed-outline" onPress={goToRenewPassword} />
        <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
        <Option title={t("ADVANCEDOPTIONS.CANCELACCOUNT")} icon="trash-outline" onPress={() => { }} />
        <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
        <Option title={t("ADVANCEDOPTIONS.FREIGHTHISTORY")} icon="list-outline" onPress={() => { }} />
        <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
        <Option title={t("ADVANCEDOPTIONS.TERMS")} icon="document-text-outline" onPress={() => { }} />
        <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
      </View>
    </View>
  );
}

export default AdvancedOptions;
