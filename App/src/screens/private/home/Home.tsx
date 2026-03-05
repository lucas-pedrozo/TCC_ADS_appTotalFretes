import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { formatName } from "@/src/utils/funcoes";
import { useAuth } from "@/src/context/AuthContext";
import { useThemeMode } from "@/src/context/ThemeContext";
import { CardUser } from "@/src/components/cards/CardUser";
import { useWeather } from "@/src/hooks/weather/useWeather";
import { CardClime } from "@/src/components/cards/CardClime";
import { useHookGetUser } from "@/src/hooks/user/hookGetUser";
import ModalNotificacoes from "@/src/components/modal/ModalNotificacoes";
import DetalhesFreteModal from "@/src/components/mapbox/MapBox";

import { TabParamList } from "@/src/routes/RoutesTabs";
import { useNavigation } from "@react-navigation/native";
import { CardVehicle } from "@/src/components/cards/CardVehicle";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CardActivityHome } from "@/src/components/cards/CardActivityHome";

function Home() {

  const { logout } = useAuth();
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const { userData, handleGetUser } = useHookGetUser();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const { weatherData, loading: weatherLoading, refetch: refetchWeather } = useWeather();

  const currentHour = new Date().getHours();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalNotificacoesVisible, setIsModalNotificacoesVisible] = useState(false);
  const [isModalRotaTesteVisible, setIsModalRotaTesteVisible] = useState(false);

  const greeting = currentHour < 12 ? t("HOME.WELCOME2") : currentHour < 18 ? t("HOME.WELCOME3") : t("HOME.WELCOME");

  const goToProfile = () => { navigation.navigate("PerfilTab"); };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([handleGetUser(), refetchWeather()]);
      setRefreshKey((prev) => prev + 1);
    } finally {
      setIsRefreshing(false);
    }
  }, [handleGetUser, refetchWeather]);

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
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={goToProfile} activeOpacity={0.7}>
              {userData?.userImage_id ? (
                <Image source={require('@/src/assets/usuario.jpg')} className="w-14 h-14 rounded-xl" />
              ) : (
                <View className="w-14 h-14 rounded-xl bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
                  <Text className="text-lightText dark:text-darkText">
                    {userData?.name ? userData.name[0] + userData.name[1] : "??"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View className="flex-col">
              <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-medium text-sm">
                {greeting}
              </Text>
              <Text className="text-lightText dark:text-darkText font-semibold text-base">
                {formatName(userData?.name ?? "-----")}
              </Text>
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
              onPress={logout}
              className="bg-lightBgNonary dark:bg-darkBgNonary p-2.5 rounded-xl"
            >
              <Ionicons name="log-out-outline" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-lightText dark:text-darkText font-bold text-2xl pt-6 pb-4">
          {t("HOME.TITLE")}
        </Text>

        <View className="flex-row items-stretch justify-between gap-3">
          <CardUser
            cnhType={userData?.CnhType?.name}
            name={userData?.name}
            navegation={goToProfile}
          />

          <CardClime
            clima={weatherData?.descricao}
            cidade={weatherData?.cidade}
            temp={weatherData?.temperatura}
            loading={weatherLoading}
            weatherCode={weatherData?.weatherCode}
          />
        </View>

        <CardActivityHome
          key={`card-activity-${refreshKey}`}
        />

        <CardVehicle
          key={`card-vehicle-${refreshKey}`}
          vehicleId={userData?.vehicleType_id}
        />

        <TouchableOpacity
          onPress={() => setIsModalRotaTesteVisible(true)}
          className="mt-4 flex-row items-center justify-center gap-2 bg-lightBgTertiary dark:bg-darkBgTertiary py-3 px-4 rounded-xl border border-lightBgNonary dark:border-darkBgNonary"
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={22} color={mode === "dark" ? "#74AEF1" : "#3498db"} />
          <Text className="text-base font-semibold text-lightText dark:text-darkText">
            Testar rota Mapbox: Curitiba → São Paulo
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalNotificacoes
        visible={isModalNotificacoesVisible}
        onClose={() => setIsModalNotificacoesVisible(false)}
        notifications={[]}
      />

      <DetalhesFreteModal
        visible={isModalRotaTesteVisible}
        onClose={() => setIsModalRotaTesteVisible(false)}
        enderecoCarga="Rua das Flores, 123, Curitiba', PR, Brasil"
        enderecoDestino="Avenida Amazonas, 648, Boa Esperança, PR, Brasil"
        nomeEmpresa="Teste"
        rotaSimples
        prazo="—"
      />
    </SafeAreaView>
  );
}

export default Home;