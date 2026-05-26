import { useCallback, useRef } from "react";
import { BackHandler, Platform, ToastAndroid } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";

import Freight from "../screens/freight/Freight";
import Perfil from "../screens/user/Perfil";
import Home from "../screens/home/Home";

import { useThemeMode } from "@/src/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OngoingFreights from "../screens/freight/OngoingFreights";
import MyProposals from "../screens/freight/MyProposals";
import { useTranslation } from "react-i18next";

export type TabParamList = {
	HomeTab: undefined;
	FretesTab: undefined;
	AndamentoTab: undefined;
	PropostaTab: undefined;
	PerfilTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_BAR_HEIGHT = 70;

export default function RoutesTabs() {
	const { t } = useTranslation();
	const { mode } = useThemeMode();
	const { logout } = useAuth();
	const insets = useSafeAreaInsets();
	const lastBackPress = useRef<number>(0);
	const currentTab = useRef<keyof TabParamList>("HomeTab");

	const isDark = mode === "dark";
	const activeColor = isDark ? "#74AEF1" : "#0B3B75";
	const inactiveColor = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
	const tabBackground = isDark ? "#202020" : "#E5E5E5";

	useFocusEffect(
		useCallback(() => {
			if (Platform.OS !== "android") return;

			const onBackPress = () => {
				if (currentTab.current !== "HomeTab") {
					return false;
				}

				const now = Date.now();
				if (now - lastBackPress.current < 2000) {
					logout();
					return true;
				}

				lastBackPress.current = now;
				ToastAndroid.show(t("TABS.PRESS_BACK_AGAIN"), ToastAndroid.SHORT);
				return true;
			};

			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
			return () => subscription.remove();
		}, [t])
	);

	return (
		<Tab.Navigator
			backBehavior="firstRoute"
			screenOptions={({ route }) => ({
				headerShown: false,
				animation: "shift",
				tabBarHideOnKeyboard: true,
				tabBarShowLabel: true,
				tabBarActiveTintColor: activeColor,
				tabBarInactiveTintColor: inactiveColor,
				tabBarStyle: {
					position: "absolute",
					left: 12,
					right: 12,
					bottom: insets.bottom + 10,
					height: TAB_BAR_HEIGHT,
					borderRadius: 16,
					marginHorizontal: 16,
					backgroundColor: tabBackground,
					paddingTop: 10,
					paddingBottom: 10,
					elevation: 0,
					shadowOpacity: 0,
					shadowRadius: 0,
				},
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "600",
				},
				tabBarIcon: ({ color, focused }) => {
					const iconMap: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
						HomeTab: "home",
						FretesTab: "car",
						AndamentoTab: "cube",
						PropostaTab: "document-text",
						PerfilTab: "person",
					};
					const size = focused ? 24 : 22;
					return (
						<Ionicons
							name={iconMap[route.name as keyof TabParamList]}
							size={size}
							color={color}
						/>
					);
				},
			})}
		>
			<Tab.Screen
				name="HomeTab"
				component={Home}
				options={{ tabBarLabel: t("TABS.HOME") }}
				listeners={{ focus: () => { currentTab.current = "HomeTab"; } }}
			/>
			<Tab.Screen
				name="FretesTab"
				component={Freight}
				options={{ tabBarLabel: t("TABS.FREIGHTS") }}
				listeners={{ focus: () => { currentTab.current = "FretesTab"; } }}
			/>
			<Tab.Screen
				name="AndamentoTab"
				component={OngoingFreights}
				options={{ tabBarLabel: t("TABS.ONGOING") }}
				listeners={{ focus: () => { currentTab.current = "AndamentoTab"; } }}
			/>
			<Tab.Screen
				name="PropostaTab"
				component={MyProposals}
				options={{ tabBarLabel: t("TABS.PROPOSAL") }}
				listeners={{ focus: () => { currentTab.current = "PropostaTab"; } }}
			/>
			<Tab.Screen
				name="PerfilTab"
				component={Perfil}
				options={{ tabBarLabel: t("TABS.PROFILE") }}
				listeners={{ focus: () => { currentTab.current = "PerfilTab"; } }}
			/>
		</Tab.Navigator>
	);
}
