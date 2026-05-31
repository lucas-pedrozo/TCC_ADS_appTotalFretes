import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/src/routes/Routes";
import type { TabParamList } from "@/src/routes/RoutesTabs";

export type HomeTabNavigationProp = CompositeNavigationProp<
	BottomTabNavigationProp<TabParamList, "HomeTab">,
	NativeStackNavigationProp<RootStackParamList>
>;

export type AndamentoTabNavigationProp = CompositeNavigationProp<
	BottomTabNavigationProp<TabParamList, "AndamentoTab">,
	NativeStackNavigationProp<RootStackParamList>
>;

export type FretesTabNavigationProp = CompositeNavigationProp<
	BottomTabNavigationProp<TabParamList, "FretesTab">,
	NativeStackNavigationProp<RootStackParamList>
>;
