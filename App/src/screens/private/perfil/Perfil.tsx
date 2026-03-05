import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { RefreshControl, ScrollView, Text, View } from "react-native"

import { Option } from "@/src/components/perfil/Option";
import { useHookGetUser } from "@/src/hooks/user/hookGetUser";
import { OptionKey } from "@/src/components/perfil/OptionKey";
import { HeaderPerfil } from "@/src/components/perfil/HeaderPerfil";
import { OptionSelect } from "@/src/components/perfil/OptionSelect";

import { useTranslation } from "react-i18next";
import type { AppLanguage } from "@/src/i18n/resources";
import { useThemeMode } from "@/src/context/ThemeContext";
import { useLanguage } from "@/src/context/LanguageContext";

import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Perfil = () => {
  const { t } = useTranslation();
  const { mode, toggleMode } = useThemeMode();
  const { language, changeLanguage } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const { userData, handleGetUser } = useHookGetUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const goToAdvancedOptions = () => { navigation.navigate("AdvancedOptions"); }

  const goToEditPerfil = () => {
    navigation.navigate("EditPerfil", {
      editPerfilData: {
        name: userData?.name ?? "",
        email: userData?.email ?? "",
        birthDate: userData?.birthDate ?? "",
        phoneNumber: userData?.phoneNumber ?? "",
        cpf: userData?.cpf ?? "",
        isDeficient: userData?.isDeficient ?? false,
        sex: userData?.sex ?? "",
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
    { value: "pt", label: "PT-BR" },
    { value: "en", label: "EN-US" },
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
          name={userData?.name || "Não informado"}
          email={userData?.email || "Não informado"}
          cpf={userData?.cpf || "Não informado"}
        />

        <View className="flex-col gap-2.5 mt-14">
          <Text className="text-sm font-semibold pl-2.5 pb-1.5 text-lightTextSecondary dark:text-darkTextSecondary">Informações Pessoais</Text>

          <Option title="Editar meus Dados" icon="pencil" onPress={goToEditPerfil} />
          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
          <Option title="Editar Dados da CNH" icon="pencil" onPress={goToEditCnh} />
          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />

          {!userData?.vehicleType_id ?
            <Option title="Cadastrar Veículo" icon="car-outline" onPress={() => { }} />
            :
            <Option title="Editar Veículo" icon="car-outline" onPress={() => { }} />
          }

          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
          <Option title="Opções Avançadas" icon="settings-outline" onPress={goToAdvancedOptions} />
        </View>

        <View className="flex-col gap-2.5 mt-5">
          <Text className="text-sm font-semibold pl-2.5 pb-1.5 text-lightTextSecondary dark:text-darkTextSecondary">Funcionamento do App</Text>

          <OptionSelect
            title="Idioma"
            icon="language-outline"
            options={idiomaOptions}
            value={language}
            onValueChange={(value) => changeLanguage(value as AppLanguage)}
          />

          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
          <OptionKey title="Modo claro" icon="sunny-outline" value={mode === "light"} setValue={() => toggleMode()} />
          <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Perfil;  