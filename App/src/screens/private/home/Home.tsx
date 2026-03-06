import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/context/AuthContext";
import { useThemeMode } from "@/src/context/ThemeContext";
import { CardUser } from "@/src/components/cards/CardUser";
import { useWeather } from "@/src/hooks/weather/useWeather";
import { CardClime } from "@/src/components/cards/CardClime";
import { useHookGetUser } from "@/src/hooks/user/hookGetUser";
import { HeaderHome } from "@/src/components/header/HeaderHome";
import ModalNotificacoes from "@/src/components/modal/ModalNotificacoes";

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

  const greeting = currentHour < 12 ? t("HOME.WELCOME2") : currentHour < 18 ? t("HOME.WELCOME3") : t("HOME.WELCOME");

  const goToProfile = () => { navigation.navigate("PerfilTab"); };
  const goToAndamento = () => { navigation.navigate("AndamentoTab"); };

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
        <HeaderHome
          userData={userData}
          greeting={greeting}
          onProfilePress={goToProfile}
          notInformedLabel={t("COMMON.NOTINFORMED")}
          onNotificationsPress={() => setIsModalNotificacoesVisible(true)}
          onLogout={logout}
        />

        <Text className="text-lightText dark:text-darkText font-bold text-2xl pt-6 pb-4"> {t("HOME.TITLE")} </Text>

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
          navegation={goToAndamento}
        />
        <CardVehicle
          key={`card-vehicle-${refreshKey}`}
          vehicleId={userData?.vehicleType_id}
        />
      </ScrollView>

      <ModalNotificacoes
        visible={isModalNotificacoesVisible}
        onClose={() => setIsModalNotificacoesVisible(false)}
        notifications={[]}
      />

    </SafeAreaView>
  );
}

export default Home;