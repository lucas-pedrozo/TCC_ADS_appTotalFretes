import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useThemeColors, useIconColor } from "@/src/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useRegisterVehicle, type VehicleGroupType } from "@/src/context/RegisterVehicleContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";

const GROUPS: { key: VehicleGroupType; label: string }[] = [
  { key: "caminhao", label: "Caminhão" },
  { key: "carreta", label: "Carreta" },
  { key: "bitrem", label: "Bitrem" },
];

const CardVehicleGroup = ({ title, onPress }: { title: string; onPress: () => void }) => {
  const iconColor = useIconColor();
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row justify-between items-center rounded-xl p-5"
      style={{ backgroundColor: colors.bgSecondary, borderWidth: 1, borderColor: colors.bgTertiary }}
    >
      <Text className="font-semibold text-base" style={{ color: colors.text }}>{title}</Text>
      <Ionicons name="chevron-forward-outline" size={22} color={iconColor} />
    </TouchableOpacity>
  );
};

const VehicleGroup = () => {
  const colors = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setGroup } = useRegisterVehicle();

  const handleSelect = (group: VehicleGroupType) => {
    setGroup(group);
    navigation.navigate("VehicleType");
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 px-4" style={{ backgroundColor: colors.bg }}>
      <Text className="pl-2.5 pb-5" style={{ color: colors.text }}>Selecione o Grupo de Veículo</Text>

      <View className="gap-4">
        {GROUPS.map((g) => (
          <CardVehicleGroup key={g.key} title={g.label} onPress={() => handleSelect(g.key)} />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default VehicleGroup;