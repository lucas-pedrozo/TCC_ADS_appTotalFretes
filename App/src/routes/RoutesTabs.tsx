import { useCallback, useRef } from "react";
import { BackHandler, Platform, Text, ToastAndroid, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";

import Freight from "../screens/freight/Freight";
import Perfil from "../screens/user/Perfil";
import Home from "../screens/home/Home";

import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OngoingFreights from "../screens/freight/OngoingFreights";

export type TabParamList = {
	HomeTab: undefined;
	FretesTab: undefined;
	AndamentoTab: undefined;
	PropostaTab: undefined;
	PerfilTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function PlaceholderScreen({ title }: { title: string }) {
	const colors = useThemeColors();
	return (
		<View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.bg }}>
			<Text className="font-semibold text-lg" style={{ color: colors.text }}>{title}</Text>
		</View>
	);
}


const PropostaScreen = () => <PlaceholderScreen title="Proposta" />;

const TAB_BAR_HEIGHT = 72;

export default function RoutesTabs() {
	const { mode } = useThemeMode();
	const { logout } = useAuth();
	const insets = useSafeAreaInsets();
	const lastBackPress = useRef<number>(0);
	const currentTab = useRef<keyof TabParamList>("HomeTab");

	const isDark = mode === "dark";
	const activeColor = isDark ? "#74AEF1" : "#0B3B75";
	const inactiveColor = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";
	const tabBackground = isDark ? "#1a1a1a" : "#FFFFFF";
	const borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

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
				ToastAndroid.show("Pressione novamente para sair", ToastAndroid.SHORT);
				return true;
			};

			const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
			return () => subscription.remove();
		}, [])
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
					bottom: insets.bottom + 8,
					height: TAB_BAR_HEIGHT,
					borderRadius: 24,
					marginHorizontal: 12,
					backgroundColor: tabBackground,
					borderTopWidth: 0,
					borderWidth: 1,
					borderColor,
					paddingTop: 10,
					paddingBottom: 10,
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
				options={{ tabBarLabel: "Home" }}
				listeners={{ focus: () => { currentTab.current = "HomeTab"; } }}
			/>
			<Tab.Screen
				name="FretesTab"
				component={Freight}
				options={{ tabBarLabel: "Fretes" }}
				listeners={{ focus: () => { currentTab.current = "FretesTab"; } }}
			/>
			<Tab.Screen
				name="AndamentoTab"
				component={OngoingFreights}
				options={{ tabBarLabel: "Andamento" }}
				listeners={{ focus: () => { currentTab.current = "AndamentoTab"; } }}
			/>
			<Tab.Screen
				name="PropostaTab"
				component={PropostaScreen}
				options={{ tabBarLabel: "Proposta" }}
				listeners={{ focus: () => { currentTab.current = "PropostaTab"; } }}
			/>
			<Tab.Screen
				name="PerfilTab"
				component={Perfil}
				options={{ tabBarLabel: "Perfil" }}
				listeners={{ focus: () => { currentTab.current = "PerfilTab"; } }}
			/>
		</Tab.Navigator>
	);
}
