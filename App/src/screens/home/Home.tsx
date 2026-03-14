import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/context/AuthContext";
import { useThemeColors, useIconColor } from "@/src/context/ThemeContext";
import { CardHistory } from "@/src/components/cards/CardHistory";
import { useWeather } from "@/src/hooks/weather/useWeather";
import { CardClime } from "@/src/components/cards/CardClime";
import { useGetUser } from "@/src/hooks/user/useGetUser";
import { HeaderHome } from "@/src/components/header/HeaderHome";
import ModalNotificacoes from "@/src/components/modal/ModalNotificacoes";

import { TabParamList } from "@/src/routes/RoutesTabs";
import { useNavigation } from "@react-navigation/native";
import { CardVehicle } from "@/src/components/cards/CardVehicle";
import { useGetVehicle } from "@/src/hooks/vehicle/useGetVehicle";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CardActivityHome } from "@/src/components/cards/CardActivityHome";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";
import { CardMap } from "@/src/components/cards/CardMap";

function Home() {
	const { logout } = useAuth();
	const { t } = useTranslation();
	const iconsColor = useIconColor()
	const colors = useThemeColors();

	const currentHour = new Date().getHours();
	const [refreshKey, setRefreshKey] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
	const [isModalNotificacoesVisible, setIsModalNotificacoesVisible] = useState(false);

	const { userData, handleGetUser } = useGetUser();
	const { vehicleData, handleGetVehicle } = useGetVehicle();
	const { freightUser, handleGetFreightUser } = useGetFreightUser();
	const { weatherData, refetch: refetchWeather } = useWeather();

	const greeting = currentHour < 12 ? t("HOME.WELCOME2") : currentHour < 18 ? t("HOME.WELCOME3") : t("HOME.WELCOME");

	const goToProfile = () => {
		navigation.navigate("PerfilTab");
	};

	const goToAndamento = () => {
		navigation.navigate("AndamentoTab");
	};

	const goToMap = () => {
		navigation.navigate("MapScreen" as never);
	};

	const handleRefresh = useCallback(async () => {
		setIsRefreshing(true);
		try {
			await Promise.all([handleGetUser(), refetchWeather(), handleGetFreightUser()]);
			setRefreshKey((prev) => prev + 1);
		} finally {
			setIsRefreshing(false);
		}
	}, [handleGetUser, refetchWeather, handleGetFreightUser]);

	useEffect(() => {
		handleGetUser();
		handleGetFreightUser();
	}, [handleGetUser, handleGetFreightUser]);

	useEffect(() => {
		const vehicleId = userData?.vehicle_id ?? null;
		if (vehicleId != null) handleGetVehicle(vehicleId);
		else handleGetVehicle(null);
	}, [userData?.vehicle_id, handleGetVehicle]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
				showsVerticalScrollIndicator={false}
				className="flex-1"
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={handleRefresh}
						tintColor={iconsColor}
					/>
				}
			>
				<View className="px-4">
					<HeaderHome
						userData={userData}
						greeting={greeting}
						onProfilePress={goToProfile}
						notInformedLabel="-----"
						onNotificationsPress={() => setIsModalNotificacoesVisible(true)}
						onLogout={logout}
					/>
					<Text className="font-bold text-2xl pt-6" style={{ color: colors.text }}> {t("HOME.TITLE")} </Text>
					<CardActivityHome
						key={`card-activity-${refreshKey}`}
						onPress={goToAndamento}
						freight={freightUser}
					/>
				</View>

				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
					className="-mx-0"
				>
					<CardClime
						clima={weatherData?.descricao}
						cidade={weatherData?.cidade}
						temp={weatherData?.temperatura}
						weatherCode={weatherData?.weatherCode}
					/>
					<View className="w-4" />
					<CardMap onPress={goToMap} />
					<View className="w-4" />
					<CardHistory />
				</ScrollView>
				<View className="px-4">
					<CardVehicle vehicle={vehicleData} />
				</View>
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
