import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { RefreshControl, ScrollView, Text, View } from "react-native"

import { baseURL } from "@/src/service/http";
import { useHookGetUser } from "@/src/hooks/user/hookGetUser";
import { useTranslation } from "react-i18next";
import type { AppLanguage } from "@/src/i18n/resources";
import { useThemeMode } from "@/src/context/ThemeContext";
import { useLanguage } from "@/src/context/LanguageContext";

import { useAuth } from "@/src/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Option } from "@/src/components/perfil/Option";
import { OptionKey } from "@/src/components/perfil/OptionKey";
import { HeaderPerfil } from "@/src/components/header/HeaderPerfil";
import { OptionSelect } from "@/src/components/perfil/OptionSelect";
import { ButtonCancel } from "@/src/components/fom/buttons/ButtonDefauilt";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Perfil = () => {
  const BASE_URL = baseURL;
  const { logout } = useAuth()
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const { language, changeLanguage } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const { userData, handleGetUser } = useHookGetUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const goToAdvancedOptions = () => { navigation.navigate("AdvancedOptions"); }

  const goToEditPerfil = () => {
    const validSex = userData?.sex && ["M", "F", "N"].includes(userData.sex) ? userData.sex : "";
    navigation.navigate("EditPerfil", {
      editPerfilData: {
        name: userData?.name ?? "",
        email: userData?.email ?? "",
        birthDate: userData?.birthDate ?? "",
        phoneNumber: userData?.phoneNumber ?? "",
        cpf: userData?.cpf ?? "",
        isDeficient: userData?.isDeficient ?? false,
        sex: validSex,
      }
    })
  }

  const goToEditCnh = () => {
    navigation.navigate("EditCnh", {
      editCnhData: {
        cnhNumber: userData?.cnhNumber ?? "",
        issuingAgencyCnh: userData?.issuingAgencyCnh ?? "",
        cnhType_id: String(userData?.cnhType_id ?? ""),
        useGlasses: userData?.useGlasses ?? false,
      }
    })
  }

  const idiomaOptions = [
    { value: "pt", label: t("PERFIL.LANGPT") },
    { value: "en", label: t("PERFIL.LANGEN") },
  ];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await handleGetUser();
    } finally {
      setIsRefreshing(false);
    }
  }, [handleGetUser]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-lightBg dark:bg-darkBg">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={mode === "dark" ? "#FFFFFF" : "#000000"}
          />
        }
      >
        <HeaderPerfil
          image={userData?.userImage_id ? `${BASE_URL}/api/user/image/${userData.userImage_id}` : undefined}
          email={userData?.email || t("COMMON.NOTINFORMED")}
          cpf={userData?.cpf || t("COMMON.NOTINFORMED")}
        />

        <View className="flex-col gap-2.5 mt-14">
          <Text className="text-sm font-semibold pl-2.5 pb-1.5 text-lightTextSecondary dark:text-darkTextSecondary">{t("PERFIL.PERSONALINFO")}</Text>
          <Option title={t("PERFIL.EDITMYDATA")} icon="pencil" onPress={goToEditPerfil} />
          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
          <Option title={t("PERFIL.EDITCNHDATA")} icon="pencil" onPress={goToEditCnh} />
          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />

          {!userData?.vehicleType_id ?
            <Option title={t("PERFIL.REGISTERVEHICLE")} icon="car-outline" onPress={() => { }} />
            :
            <Option title={t("PERFIL.EDITVEHICLE")} icon="car-outline" onPress={() => { }} />
          }

          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
          <Option title={t("PERFIL.ADVANCEDOPTIONS")} icon="settings-outline" onPress={goToAdvancedOptions} />
        </View>
        <View className="flex-col gap-2.5 mt-5">
          <Text className="text-sm font-semibold pl-2.5 pb-1.5 text-lightTextSecondary dark:text-darkTextSecondary">{t("PERFIL.APPBEHAVIOR")}</Text>
          <OptionSelect
            title={t("PERFIL.LANGUAGE")}
            icon="language-outline"
            options={idiomaOptions}
            value={language}
            onValueChange={(value) => changeLanguage(value as AppLanguage)}
          />
          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
          <OptionKey title={t("PERFIL.LIGHTMODE")} icon="sunny-outline" value={mode === "light"} setValue={() => toggleMode()} />
          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
        </View>

          <View className="w-5/12 self-end pt-8 ">
            <ButtonCancel title={t("PERFIL.LOGOUT")} onPress={logout}  />
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Perfil;  