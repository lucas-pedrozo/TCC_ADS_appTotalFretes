import "react-native-gesture-handler";

import RoutesTabs, { type TabParamList } from "./RoutesTabs";
import { StatusBar } from "expo-status-bar";
import PrivateRoute from "./PrivateRoutes";
import { useTranslation } from "react-i18next";
import Header from "../components/header/Header";
import { useThemeMode } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from "../screens/auth/Start";
import Login from "../screens/auth/Login";
import EditCnh from "../screens/user/EditCnh";
import SingUp from "../screens/auth/SingUp/SingUpBasic";
import SingUpCNH from "../screens/auth/SingUp/SingUpCNH";
import EditPerfil from "../screens/user/EditPerfil";
import NewPassword from "../screens/auth/NewPassword";
import SingUpPassword from "../screens/auth/SingUp/SingUpPassword";
import ForgotPassword from "../screens/auth/ForgotPassword";
import CancelAccount from "../screens/user/CancelAccount";
import VerificationCode from "../screens/auth/VerificationCode";
import AdvancedOptions from "../screens/user/AdvancedOptions";
import DetailFreight from "../screens/freight/DetailFreight";
import DetailVehicle from "../screens/freight/DetailVehicle";
import EditVehicle from "../screens/freight/EditVehicle";
import SendProposal from "../screens/freight/SendProposal";
import ProposalDetail from "../screens/freight/ProposalDetail";
import FreightHistory from "../screens/freight/FreightHistory";

import RenewPassword from "../screens/user/RenewPassword";
import VehicleGroup from "../screens/freight/VehicleGroup";
import VehicleType from "../screens/freight/VehicleType";
import VehicleData from "../screens/freight/VehicleData";
import { EditPerfilMap, EditCnhMap } from "@/src/interfaces/profile";
import Term from "../screens/advance/Term";
import MapScreen from "../screens/MapBox/MapScreen";

import type { FreightAllMap } from "@/src/hooks/freight/useGetAllFreigth";
import type { FreightMap } from "@/src/context/FreightUserContext";
import type { MapVehicle } from "@/src/interfaces";

interface EditPerfilRouteParams {
	editPerfilData: EditPerfilMap;
	userImage?: string;
}

interface EditCnhRouteParams {
	editCnhData: EditCnhMap;
	userName?: string;
	userImageUrl?: string;
}


export type RootStackParamList = {
	Home: NavigatorScreenParams<TabParamList> | undefined;
	Login: { startMode?: "saved" | "full"; focusPassword?: boolean; };
	Start: undefined;
	SingUp: undefined;
	SingUpCNH: undefined;
	SingUpPassword: undefined;
	ForgotPassword: undefined;
	VerificationCode: { email: string };
	EditPerfil: EditPerfilRouteParams;
	EditCnh: EditCnhRouteParams;
	AdvancedOptions: undefined;
	NewPassword: { email: string; resetToken: string };
	CancelAccount: undefined;
	RenewPassword: undefined;
	DetailFreight: { freight: FreightMap | FreightAllMap };
	SendProposal: { freight: FreightMap | FreightAllMap };
	ProposalDetail: { proposalId: number };
	DetailVehicle: { vehicle: MapVehicle };
	EditVehicle: { vehicle: MapVehicle };
	VehicleGroup: undefined;
	VehicleType: undefined;
	VehicleData: undefined;
	Term: undefined;
	MapScreen: undefined;
	FreightHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function PrivateHome() {
	return <PrivateRoute><RoutesTabs /></PrivateRoute>;
}

function PrivateEditPerfil() {
	return <PrivateRoute><EditPerfil /></PrivateRoute>;
}

function PrivateEditCnh() {
	return <PrivateRoute><EditCnh /></PrivateRoute>;
}

function PrivateAdvancedOptions() {
	return <PrivateRoute><AdvancedOptions /></PrivateRoute>;
}

function PrivateCancelAccount() {
	return <PrivateRoute><CancelAccount /></PrivateRoute>;
}

function PrivateRenewPassword() {
	return <PrivateRoute><RenewPassword /></PrivateRoute>;
}

function PrivateDetailFreight() {
	return <PrivateRoute><DetailFreight /></PrivateRoute>;
}

function PrivateSendProposal() {
	return <PrivateRoute><SendProposal /></PrivateRoute>;
}

function PrivateProposalDetail() {
	return <PrivateRoute><ProposalDetail /></PrivateRoute>;
}

function PrivateDetailVehicle() {
	return <PrivateRoute><DetailVehicle /></PrivateRoute>;
}

function PrivateEditVehicle() {
	return <PrivateRoute><EditVehicle /></PrivateRoute>;
}

function PrivateVehicleGroup() {
	return <PrivateRoute><VehicleGroup /></PrivateRoute>;
}

function PrivateVehicleType() {
	return <PrivateRoute><VehicleType /></PrivateRoute>;
}

function PrivateVehicleData() {
	return <PrivateRoute><VehicleData /></PrivateRoute>;
}

function PrivateTerm() {
	return <PrivateRoute><Term /></PrivateRoute>;
}

function PrivateMapScreen() {
	return <PrivateRoute><MapScreen /></PrivateRoute>;
}

function PrivateFreightHistory() {
	return <PrivateRoute><FreightHistory /></PrivateRoute>;
}

export default function Routes() {
	const { theme } = useThemeMode();
	const { t } = useTranslation();
	const backgroundColor = theme.colors.background;

	return (
		<NavigationContainer theme={theme}>
			<StatusBar
				style={backgroundColor === "#000000" ? "light" : "dark"}
				backgroundColor={backgroundColor}
			/>

			<Stack.Navigator
				initialRouteName="Start"
				screenOptions={{
					header: ({ options }) => (
						options.title ? (
							<SafeAreaView edges={["top"]} style={{ paddingHorizontal: 16, backgroundColor }}>
								<Header title={options.title} />
							</SafeAreaView>
						) : null
					),
				}}
			>
				<Stack.Screen name="Home" component={PrivateHome} options={{ headerShown: false }} />
				<Stack.Screen name="EditCnh" component={PrivateEditCnh} options={{ title: t("ROUTES.EDITCNH") }} />
				<Stack.Screen name="EditPerfil" component={PrivateEditPerfil} options={{ title: t("ROUTES.EDITPERFIL") }} />
				<Stack.Screen name="AdvancedOptions" component={PrivateAdvancedOptions} options={{ title: t("ROUTES.ADVANCEDOPTIONS") }} />
				<Stack.Screen name="CancelAccount" component={PrivateCancelAccount} options={{ title: t("ROUTES.CANCELACCOUNT") }} />
				<Stack.Screen name="RenewPassword" component={PrivateRenewPassword} options={{ title: t("ROUTES.RENEWPASSWORD") }} />
			<Stack.Screen name="DetailFreight" component={PrivateDetailFreight} options={{ title: t("ROUTES.DETAILFREIGHT") }} />
			<Stack.Screen name="SendProposal" component={PrivateSendProposal} options={{ title: t("ROUTES.SENDPROPOSAL") }} />
			<Stack.Screen name="ProposalDetail" component={PrivateProposalDetail} options={{ title: t("ROUTES.PROPOSALDETAIL") }} />
			<Stack.Screen name="DetailVehicle" component={PrivateDetailVehicle} options={{ title: t("ROUTES.DETAILVEHICLE") }} />
			<Stack.Screen name="EditVehicle" component={PrivateEditVehicle} options={{ title: t("ROUTES.EDITVEHICLE") }} />
			<Stack.Screen name="VehicleGroup" component={PrivateVehicleGroup} options={{ title: t("ROUTES.VEHICLEGROUP") }} />
				<Stack.Screen name="VehicleType" component={PrivateVehicleType} options={{ title: t("ROUTES.VEHICLETYPE") }} />
				<Stack.Screen name="VehicleData" component={PrivateVehicleData} options={{ title: t("ROUTES.VEHICLEDATA") }} />
				<Stack.Screen name="Term" component={PrivateTerm} options={{ title: t("ROUTES.TERM") }} />
				<Stack.Screen name="MapScreen" component={PrivateMapScreen} options={{ headerShown: false }} />
				<Stack.Screen name="FreightHistory" component={PrivateFreightHistory} options={{ title: t("ROUTES.FREIGHTHISTORY") }} />
				
				<Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
				<Stack.Screen name="Login" component={Login} options={{ title: t("ROUTES.LOGIN") }} />
				<Stack.Screen name="SingUp" component={SingUp} options={{ title: t("ROUTES.SIGNUPBASIC") }} />
				<Stack.Screen name="SingUpCNH" component={SingUpCNH} options={{ title: t("ROUTES.SIGNUPCNH") }} />
				<Stack.Screen name="NewPassword" component={NewPassword} options={{ title: t("ROUTES.NEWPASSWORD") }} />
				<Stack.Screen name="SingUpPassword" component={SingUpPassword} options={{ title: t("ROUTES.SIGNUPPASSWORD") }} />
				<Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: t("ROUTES.FORGOTPASSWORD") }} />
				<Stack.Screen name="VerificationCode" component={VerificationCode} options={{ title: t("ROUTES.VERIFICATIONCODE") }} />

			</Stack.Navigator>
		</NavigationContainer>
	);
}
