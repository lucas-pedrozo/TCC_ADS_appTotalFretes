import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useThemeColors, useIconColor } from "@/src/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useRegisterVehicleContext, VehicleGroupType } from "@/src/context/RegisterVehicleContext";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";
import http from "@/src/services/http";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

type GroupItem = { id: number; nome: string; key: VehicleGroupType };

const nomeToKey: Record<string, VehicleGroupType> = {
  Caminhão: "caminhao",
  Carreta: "carreta",
  Bitrem: "bitrem",
};

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
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setGroup, setGroupVehicleTypeId } = useRegisterVehicleContext();
  const { notify } = useAlertDefault();
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await http.get<Array<{ id: number; nome: string }>>("/group-vehicle-type");
      const mapped: GroupItem[] = data
        .map((g) => {
          const key = nomeToKey[g.nome];
          return key ? { id: g.id, nome: g.nome, key } : null;
        })
        .filter((g): g is GroupItem => g != null);
      setGroups(mapped);
    } catch (err) {
      const message = (err as AxiosError<{ message?: string }>).response?.data?.message ?? t("VEHICLE.LOAD_GROUPS_ERROR");
      notify({ status: "error", message });
    } finally {
      setLoading(false);
    }
  }, [notify, t]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleSelect = (item: GroupItem) => {
    setGroup(item.key);
    setGroupVehicleTypeId(item.id);
    navigation.navigate("VehicleType");
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 px-4" style={{ backgroundColor: colors.bg }}>
      <Text className="pl-2.5 pb-5" style={{ color: colors.text }}>{t("VEHICLE.GROUP_SELECT")}</Text>

      {loading ? (
        <View className="items-center py-8">
          <ActivityIndicator size="small" color={colors.text} />
        </View>
      ) : (
        <View className="gap-4">
          {groups.map((g) => (
            <CardVehicleGroup key={g.id} title={g.nome} onPress={() => handleSelect(g)} />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default VehicleGroup;
