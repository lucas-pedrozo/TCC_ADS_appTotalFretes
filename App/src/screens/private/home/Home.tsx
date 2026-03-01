import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { formatName } from "@/src/utils/funcoes";
import { useAuth } from "@/src/context/AuthContext";
import { useThemeMode } from "@/src/context/ThemeContext";
import { CardUser } from "@/src/components/cards/CardUser";
import { CardClime } from "@/src/components/cards/CardClime";
import ModalLogout from "@/src/components/modal/ModalLogout";
import { useHookGetUser } from "@/src/hooks/user/hookGetUser";
import ModalNotificacoes from "@/src/components/modal/ModalNotificacoes";

import { TabParamList } from "@/src/routes/RoutesTabs";
import { useNavigation } from "@react-navigation/native";
import { CardVehicle } from "@/src/components/cards/CardVehicle";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CardActivityHome } from "@/src/components/cards/CardActivityHome";

function Home() {

  const { logout, } = useAuth();
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const { userData, handleGetUser } = useHookGetUser();

  const [isModalLogoutVisible, setIsModalLogoutVisible] = useState(false);
  const [isModalNotificacoesVisible, setIsModalNotificacoesVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const goToProfile = () => { navigation.navigate("PerfilTab"); }

  const handleConfirmLogout = () => {
    setIsModalLogoutVisible(false);
    logout();
  };

  useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await handleGetUser();
      setRefreshKey((prev) => prev + 1);
    } finally {
      setIsRefreshing(false);
    }
  }, [handleGetUser]);

  const notifications = [
    { id: 1, title: "Bem-vindo!", message: "Obrigado por usar nosso app." },
    { id: 2, title: "Atualização", message: "Seu perfil foi atualizado com sucesso." },
    { id: 3, title: "Atualização", message: "Seu perfil foi atualizado com sucesso." },
    { id: 4, title: "Atualização", message: "Seu perfil foi atualizado com sucesso." },
    { id: 5, title: "Atualização", message: "Seu perfil foi atualizado com sucesso." },
  ];

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

        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
              <Image source={require('@/src/assets/usuario.jpg')} className="w-14 h-14 rounded-xl" />
            </TouchableOpacity>
            <View className="flex-col">
              <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-medium text-sm">Goodnight</Text>
              <Text className="text-lightText dark:text-darkText font-semibold text-base">{formatName(userData?.name ?? "-----")}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2.5">
            <TouchableOpacity
              onPress={() => setIsModalNotificacoesVisible(true)}
              className="bg-lightBgNonary dark:bg-darkBgNonary p-2.5 rounded-xl"
            >
              <Ionicons name="notifications-outline" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsModalLogoutVisible(true)}
              className="bg-lightBgNonary dark:bg-darkBgNonary p-2.5 rounded-xl"
            >
              <Ionicons name="log-out-outline" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-lightText dark:text-darkText font-bold text-2xl pt-6 pb-4">
          {t("home.title")}
        </Text>

        <View className="flex-row items-stretch justify-between gap-3">
          <CardUser
            cnhType={userData?.CnhType?.name}
            name={userData?.name}
            navegation={goToProfile}
          />

          <CardClime
            key={`card-clime-${refreshKey}`}
          />
        </View>

        <CardActivityHome
          key={`card-activity-${refreshKey}`}
        />

        <CardVehicle
          key={`card-vehicle-${refreshKey}`}
          vehicleId={userData?.vehicleType_id}
        />

      </ScrollView>

      <ModalLogout
        visible={isModalLogoutVisible}
        onCancel={() => setIsModalLogoutVisible(false)}
        onConfirm={handleConfirmLogout}
      />

      <ModalNotificacoes
        visible={isModalNotificacoesVisible}
        onClose={() => setIsModalNotificacoesVisible(false)}
        notifications={notifications}
      />
    </SafeAreaView>
  );
}

export default Home;