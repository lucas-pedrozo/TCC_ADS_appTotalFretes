import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useRegisterVehicle, type VehicleTypeData } from "@/src/context/RegisterVehicleContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";

const VEHICLE_TYPES: VehicleTypeData[] = [
  { id: 1, name: "Caminhão Toco", image: "https://i.imgur.com/8QKZbOX.png", axle: 2, grossWeight: "16T", length: "14m" },
  { id: 2, name: "Caminhão Truck", image: "https://i.imgur.com/8QKZbOX.png", axle: 3, grossWeight: "23T", length: "14m" },
  { id: 3, name: "Caminhão 3/4", image: "https://i.imgur.com/8QKZbOX.png", axle: 2, grossWeight: "11.5T", length: "8m" },
  { id: 4, name: "Caminhão VUC", image: "https://i.imgur.com/8QKZbOX.png", axle: 2, grossWeight: "7T", length: "6.3m" },
];

const CardType = ({ item, onPress }: { item: VehicleTypeData; onPress: () => void }) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: colors.bgSecondary, borderWidth: 1, borderColor: colors.bgTertiary }}
    >
      <View className="items-center justify-center p-4">
        <Image
          source={{ uri: item.image }}
          className="w-full h-[120px]"
          resizeMode="contain"
        />
      </View>

      <View className="flex-row justify-between px-4 pb-2">
        <Text className="text-sm" style={{ color: colors.text }}>Eixo: {item.axle}</Text>
        <Text className="text-sm" style={{ color: colors.text }}>Peso Bruto: {item.grossWeight}</Text>
      </View>
      <View className="px-4 pb-4">
        <Text className="text-sm" style={{ color: colors.text }}>Comprimento: {item.length}</Text>
      </View>
    </TouchableOpacity>
  );
};

const VehicleType = () => {
  const colors = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setVehicleType } = useRegisterVehicle();

  const handleSelect = (type: VehicleTypeData) => {
    setVehicleType(type);
    navigation.navigate("VehicleData");
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 px-4" style={{ backgroundColor: colors.bg }}>
      <Text className="pl-2.5 pb-5" style={{ color: colors.text }}>Selecione o Tipo do veículo</Text>

      <FlatList
        data={VEHICLE_TYPES}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
        renderItem={({ item }) => (
          <CardType item={item} onPress={() => handleSelect(item)} />
        )}
      />
    </SafeAreaView>
  );
};

export default VehicleType;