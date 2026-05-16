import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useThemeColors } from "@/src/context/ThemeContext";
import { useRegisterVehicleContext, VehicleTypeData } from "@/src/context/RegisterVehicleContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";
import http from "@/src/services/http";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

type VehicleTypeApi = {
  id: number;
  nome: string;
  axes: number;
  weight: number;
  capacityWeight: number;
  length: number;
  groupVehicleType_id?: number | null;
};

const CardType = ({ item, onPress }: { item: VehicleTypeData; onPress: () => void }) => {
  const colors = useThemeColors();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: colors.bgSecondary, borderWidth: 1, borderColor: colors.bgTertiary }}
    >
      <View className="items-center justify-center p-4 min-h-[120px]">
        {item.image ? (
          <Image source={{ uri: item.image }} className="w-full h-[120px]" resizeMode="contain" />
        ) : (
          <Image
            source={require("@/src/assets/veiculo.png")}
            className="w-full h-[120px]"
            resizeMode="contain"
          />
        )}
      </View>

      <View className="flex-row justify-between px-4 pb-2">
        <Text className="text-sm" style={{ color: colors.text }}>{t("VEHICLE.AXLE")}: {item.axle}</Text>
        <Text className="text-sm" style={{ color: colors.text }}>{t("VEHICLE.GROSS_WEIGHT")}: {item.grossWeight}</Text>
      </View>
      <View className="px-4 pb-4">
        <Text className="text-sm" style={{ color: colors.text }}>{t("VEHICLE.LENGTH")}: {item.length}</Text>
      </View>
    </TouchableOpacity>
  );
};

function mapApiToVehicleTypeData(row: VehicleTypeApi): VehicleTypeData {
  return {
    id: row.id,
    name: row.nome ?? "",
    image: "",
    axle: row.axes ?? 0,
    grossWeight: String(row.weight ?? row.capacityWeight ?? 0),
    length: String(row.length ?? 0),
  };
}

const VehicleType = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setVehicleType, groupVehicleTypeId } = useRegisterVehicleContext();
  const { notify } = useAlertDefault();
  const [types, setTypes] = useState<VehicleTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await http.get<VehicleTypeApi[]>("/vehicle-type");
      const filtered = groupVehicleTypeId != null
        ? data.filter((t) => t.groupVehicleType_id === groupVehicleTypeId)
        : data;
      setTypes(filtered.map(mapApiToVehicleTypeData));
    } catch (err) {
      const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? t("VEHICLE.LOAD_TYPES_ERROR");
      notify({ status: "error", message });
    } finally {
      setLoading(false);
    }
  }, [groupVehicleTypeId, notify, t]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const handleSelect = (type: VehicleTypeData) => {
    setVehicleType(type);
    navigation.navigate("VehicleData");
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 px-4" style={{ backgroundColor: colors.bg }}>
      <Text className="pl-2.5 pb-5" style={{ color: colors.text }}>{t("VEHICLE.TYPE_SELECT")}</Text>

      {loading ? (
        <View className="items-center py-8">
          <ActivityIndicator size="small" color={colors.text} />
        </View>
      ) : (
        <FlatList
          data={types}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
          renderItem={({ item }) => (
            <CardType item={item} onPress={() => handleSelect(item)} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default VehicleType;
