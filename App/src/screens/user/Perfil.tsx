import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { Platform, RefreshControl, ScrollView, Text, View } from "react-native"
import * as LocalAuthentication from "expo-local-authentication";

import { useGetUser } from "@/src/hooks/user/useGetUser";
import { useTranslation } from "react-i18next";
import type { AppLanguage } from "@/src/i18n/resources";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { useLanguage } from "@/src/context/LanguageContext";

import { useAuth } from "@/src/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { HeaderPerfil } from "@/src/components/header/HeaderPerfil";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Option, OptionKey, OptionSelect, ButtonCancel } from "@/src/components/form";
import { ENV_BASE_URL } from "@env";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const isNative = Platform.OS === "ios" || Platform.OS === "android";

const Perfil = () => {
  const colors = useThemeColors();
  const { logout, biometricsEnabled, setBiometricsEnabledAsync } = useAuth()
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const { language, changeLanguage } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const { userData, handleGetUser } = useGetUser();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const userImageUrl = userData?.UserImage?.path
    ? `${ENV_BASE_URL}${userData.UserImage.path}`
    : undefined;

  const goToAdvancedOptions = () => { navigation.navigate("AdvancedOptions"); }
  const goToVehicleGroup = () => { navigation.navigate("VehicleGroup"); }

  const idiomaOptions = [
    { value: "pt", label: t("PERFIL.LANGPT") },
    { value: "en", label: t("PERFIL.LANGEN") },
  ];

  const goToEditPerfil = useCallback(() => {
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
      },
      userImage: userImageUrl,
    })
  }, [navigation, userData, userImageUrl]);

  const goToEditCnh = useCallback(() => {
    navigation.navigate("EditCnh", {
      editCnhData: {
        cnhNumber: userData?.cnhNumber ?? "",
        issuingAgencyCnh: userData?.issuingAgencyCnh ?? "",
        cnhType_id: Number(userData?.cnhType_id) || 0,
        useGlasses: userData?.useGlasses ?? false,
      },
      userName: userData?.name ?? "",
      userImageUrl,
    });
  }, [navigation, userData, userImageUrl]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await handleGetUser();
    } finally {
      setIsRefreshing(false);
    }
  }, [handleGetUser]);

  const handleBiometricsToggle = useCallback(async (val: boolean) => {
    if (val) {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: t("PERFIL.BIOMETRICS_PROMPT"),
        fallbackLabel: t("PERFIL.BIOMETRICS_FALLBACK"),
      });
      if (success) {
        await setBiometricsEnabledAsync(true);
      } else {
        await setBiometricsEnabledAsync(false);
      }
    } else {
      await setBiometricsEnabledAsync(false);
    }
  }, [setBiometricsEnabledAsync, t]);

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
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
          image={userImageUrl}
          name={userData?.name || t("COMMON.NOTINFORMED")}
          email={userData?.email || t("COMMON.NOTINFORMED")}
          cpf={userData?.cpf || t("COMMON.NOTINFORMED")}
        />

        <View className="flex-col gap-2.5 mt-14">
          <Text className="text-sm font-semibold pl-2.5 pb-1.5" style={{ color: colors.textSecondary }}>{t("PERFIL.PERSONALINFO")}</Text>
          <Option title={t("PERFIL.EDITMYDATA")} icon="pencil" onPress={goToEditPerfil} />
          <View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
          <Option title={t("PERFIL.EDITCNHDATA")} icon="pencil" onPress={goToEditCnh} />
          <View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />

          {!userData?.vehicle_id ?
            <Option title={t("PERFIL.REGISTERVEHICLE")} icon="car-outline" onPress={goToVehicleGroup} />
            :
            <Option title={t("PERFIL.EDITVEHICLE")} icon="car-outline" onPress={goToVehicleGroup} />
          }

          <View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
          <Option title={t("PERFIL.ADVANCEDOPTIONS")} icon="settings-outline" onPress={goToAdvancedOptions} />
        </View>
        <View className="flex-col gap-2.5 mt-5">
          <Text className="text-sm font-semibold pl-2.5 pb-1.5" style={{ color: colors.textSecondary }}>{t("PERFIL.APPBEHAVIOR")}</Text>
          <OptionSelect
            title={t("PERFIL.LANGUAGE")}
            icon="language-outline"
            options={idiomaOptions}
            value={language}
            onValueChange={(value) => changeLanguage(value as AppLanguage)}
          />
          <View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
          <OptionKey title={t("PERFIL.DARKMODE")} icon="moon-outline" value={mode === "dark"} setValue={() => toggleMode()} />
          {isNative ? (
            <>
              <View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
              <OptionKey
                title={Platform.OS === "ios" ? t("PERFIL.BIOMETRICS_FACE_ID") : t("PERFIL.BIOMETRICS")}
                icon={Platform.OS === "ios" ? "eye-outline" : "finger-print-outline"}
                value={biometricsEnabled}
                setValue={handleBiometricsToggle}
              />
            </>
          ) : null}
          <View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
        </View>

        <View className="w-5/12 self-end pt-8 ">
          <ButtonCancel title={t("PERFIL.LOGOUT")} onPress={logout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Perfil;
