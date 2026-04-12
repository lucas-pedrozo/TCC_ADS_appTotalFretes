import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Option } from "@/src/components/form";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "@/src/routes/Routes";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const AdvancedOptions = () => {
	const colors = useThemeColors();
	const { t } = useTranslation();
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const goToRenewPassword = () => {
		navigation.navigate("RenewPassword");
	}

	const goToCancelAccount = () => {
		navigation.navigate("CancelAccount");
	}

	const goToTerm = () => {
		navigation.navigate("Term");
	}

	return (
		<SafeAreaView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10, backgroundColor: colors.bg }} edges={["left", "right"]}>
			<View className="flex-col gap-2.5">
				<Option title={t("ADVANCEDOPTIONS.RESETPASSWORD")} icon="lock-closed-outline" onPress={goToRenewPassword} />
				<View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
				<Option title={t("ADVANCEDOPTIONS.CANCELACCOUNT")} icon="trash-outline" onPress={goToCancelAccount} critical />
				<View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
				<Option title={t("ADVANCEDOPTIONS.FREIGHTHISTORY")} icon="list-outline" onPress={() => { }} />
				<View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
				<Option title={t("ADVANCEDOPTIONS.TERMS")} icon="document-text-outline" onPress={goToTerm} />
				<View className="h-0.5 w-full rounded-full" style={{ backgroundColor: colors.bgNonary }} />
			</View>
		</SafeAreaView>
	);
}

export default AdvancedOptions;
