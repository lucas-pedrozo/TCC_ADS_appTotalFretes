import { ScrollView, Text, View } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";
import { useThemeColors } from "@/src/context/ThemeContext";
import { DetailRow } from "@/src/components/info/DetailRow";
import { CardFreight } from "@/src/components/cards/CardFreight";
import { maskDate } from "@/src/utils/formMask";
import { CardActivityHome } from "@/src/components/cards/CardActivityHome";

type DetailFreightRouteProp = RouteProp<RootStackParamList, "DetailFreight">;

const DetailFreight = () => {
    const route = useRoute<DetailFreightRouteProp>();
    const colors = useThemeColors();
    const freight = route.params.freight;

    return (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 50, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
        </ScrollView>
    )
}

export default DetailFreight;