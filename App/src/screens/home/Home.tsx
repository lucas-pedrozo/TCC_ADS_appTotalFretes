import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/context/AuthContext";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { CardHistory } from "@/src/components/cards/CardHistory";
import { CardIntention } from "@/src/components/cards/CardIntention";
import { useWeather } from "@/src/hooks/weather/useWeather";
import { CardClime } from "@/src/components/cards/CardClime";
import { useGetUser } from "@/src/hooks/user/useGetUser";
import { HeaderHome } from "@/src/components/header/HeaderHome";
import ModalNotificacoes from "@/src/components/modal/ModalNotificacoes";

import { TabParamList } from "@/src/routes/RoutesTabs";
import { useNavigation } from "@react-navigation/native";
import { CardVehicle } from "@/src/components/cards/CardVehicle";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CardActivityHome } from "@/src/components/cards/CardActivityHome";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";
import { useGetVehicle } from "@/src/hooks/vehicle/useGetVehicle";

function Home() {
	const colors = useThemeColors();
	const { logout } = useAuth();
	const { t } = useTranslation();
	const { mode } = useThemeMode();
	const { userData, handleGetUser } = useGetUser();
	const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
	const { weatherData, loading: weatherLoading, refetch: refetchWeather } = useWeather();

	const currentHour = new Date().getHours();
	const [refreshKey, setRefreshKey] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isModalNotificacoesVisible, setIsModalNotificacoesVisible] = useState(false);
	const { freightUser, handleGetFreightUser } = useGetFreightUser();
	const { vehicleData, handleGetVehicle, isLoading: vehicleLoading } = useGetVehicle();

	const greeting = currentHour < 12 ? t("HOME.WELCOME2") : currentHour < 18 ? t("HOME.WELCOME3") : t("HOME.WELCOME");

	const goToProfile = () => { navigation.navigate("PerfilTab"); };
	const goToAndamento = () => { navigation.navigate("AndamentoTab"); };

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		try {
			await Promise.all([handleGetUser(), refetchWeather(), handleGetFreightUser()]);
			if (userData?.vehicleType_id) {
				await handleGetVehicle(userData.vehicleType_id);
			}
			setRefreshKey((prev) => prev + 1);
		} finally {
			setIsRefreshing(false);
		}
	}, [handleGetUser, refetchWeather, handleGetFreightUser, handleGetVehicle, userData?.vehicleType_id]);

	useEffect(() => {
		handleGetUser();
		handleGetFreightUser();
	}, [handleGetUser, handleGetFreightUser]);

	useEffect(() => {
		if (userData?.vehicleType_id) {
			handleGetVehicle(userData.vehicleType_id);
		}
	}, [userData?.vehicleType_id, handleGetVehicle]);

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
				<HeaderHome
					userData={userData}
					greeting={greeting}
					onProfilePress={goToProfile}
					notInformedLabel={t("COMMON.NOTINFORMED")}
					onNotificationsPress={() => setIsModalNotificacoesVisible(true)}
					onLogout={logout}
				/>

				<Text className="font-bold text-2xl pt-6" style={{ color: colors.text }}> {t("HOME.TITLE")} </Text>

				<CardActivityHome
					key={`card-activity-${refreshKey}`}
					onPress={goToAndamento}
					freight={freightUser}
				/>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingVertical: 20 }}
					className="-mx-0"
				>
					<CardClime
						clima={weatherData?.descricao}
						cidade={weatherData?.cidade}
						temp={weatherData?.temperatura}
						loading={weatherLoading}
						weatherCode={weatherData?.weatherCode}
					/>
					<View className="w-4" />
					<CardIntention />
					<View className="w-4" />
				<CardHistory />
				</ScrollView>

				<CardVehicle
					key={`card-vehicle-${refreshKey}`}
					vehicle={vehicleData}
					loading={vehicleLoading}
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
