import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "@/src/screens/private/Home";
import { useThemeMode } from "@/src/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TabParamList = {
	HomeTab: undefined;
	FretesTab: undefined;
	AndamentoTab: undefined;
	PropostaTab: undefined;
	PerfilTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function PlaceholderScreen({ title }: { title: string }) {
	return (
		<View className="flex-1 items-center justify-center bg-lightBg dark:bg-darkBg">
			<Text className="text-lightText dark:text-darkText font-semibold text-lg">{title}</Text>
		</View>
	);
}

const FretesScreen = () => <PlaceholderScreen title="Fretes" />;
const AndamentoScreen = () => <PlaceholderScreen title="Andamento" />;
const PropostaScreen = () => <PlaceholderScreen title="Proposta" />;
const PerfilScreen = () => <PlaceholderScreen title="Perfil" />;

export default function RoutesTabs() {
	const { mode } = useThemeMode();

  const insets = useSafeAreaInsets();

	const activeColor = mode === "dark" ? "#FFFFFF" : "#000000";
	const inactiveColor = mode === "dark" ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)";
	const tabBackground = mode === "dark" ? "#202020" : "#E5E5E5";

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				animation: "shift",
				tabBarShowLabel: true,
				tabBarActiveTintColor: activeColor,
				tabBarInactiveTintColor: inactiveColor,
				tabBarStyle: {
					position: "absolute",
					marginHorizontal: 16,
					marginBottom: insets.bottom,
					height: 76,
					borderRadius: 20,
					backgroundColor: tabBackground,
					borderTopWidth: 0,
					elevation: 0,
					shadowOpacity: 0,
					paddingTop: 8,
					paddingBottom: 8,
				},
				tabBarLabelStyle: {
					fontSize: 13,
					fontWeight: "600",
				},
				tabBarIcon: ({ color, size }) => {
					const iconMap: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
						HomeTab: "home-outline",
						FretesTab: "car-outline",
						AndamentoTab: "cube-outline",
						PropostaTab: "cube-outline",
						PerfilTab: "person-outline",
					};

					return <Ionicons name={iconMap[route.name as keyof TabParamList]} size={size} color={color} />;
				},
			})}
		>
			<Tab.Screen name="HomeTab" component={Home} options={{ tabBarLabel: "Home" }} />
			<Tab.Screen name="FretesTab" component={FretesScreen} options={{ tabBarLabel: "Fretes" }} />
			<Tab.Screen name="AndamentoTab" component={AndamentoScreen} options={{ tabBarLabel: "Andamento" }} />
			<Tab.Screen name="PropostaTab" component={PropostaScreen} options={{ tabBarLabel: "Proposta" }} />
			<Tab.Screen name="PerfilTab" component={PerfilScreen} options={{ tabBarLabel: "Perfil" }} />
		</Tab.Navigator>
	);
}
