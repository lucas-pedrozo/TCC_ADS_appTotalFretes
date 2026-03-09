import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { useRegisterVehicle, type VehiclePlateData } from "@/src/context/RegisterVehicleContext";
import { InputDefault, ButtonDefault } from "@/src/components/form";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/src/routes/Routes";

const VehicleData = () => {
  const colors = useThemeColors();
  const iconColor = useIconColor();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { vehicleType, setPlateData, getPayload } = useRegisterVehicle();

  const { control, handleSubmit } = useForm<VehiclePlateData>({
    defaultValues: { plate: "", country: "Brasil", state: "", city: "" },
  });

  const onSubmit = (data: VehiclePlateData) => {
    setPlateData(data);
    const payload = { ...getPayload(), ...data };
    console.log("Vehicle payload:", payload);
    navigation.popToTop();
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1" style={{ backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="pl-2.5 pb-4" style={{ color: colors.text }}>Informe os dados do veículo</Text>

        <View className="items-center mb-4">
          {vehicleType?.image ? (
            <Image
              source={{ uri: vehicleType.image }}
              className="w-[260px] h-[140px]"
              resizeMode="contain"
            />
          ) : (
            <View
              className="w-[260px] h-[140px] rounded-2xl items-center justify-center"
              style={{ backgroundColor: colors.bgNonary }}
            >
              <Ionicons name="car-outline" size={60} color={iconColor} />
            </View>
          )}

          <View
            className="mt-2 rounded-lg px-4 py-2 items-center"
            style={{ backgroundColor: colors.bgTertiary }}
          >
            <Text className="text-xs" style={{ color: colors.textTertiary }}>Brasil</Text>
            <Text className="text-lg font-bold tracking-widest" style={{ color: colors.textTertiary }}>
              ABC-1234
            </Text>
          </View>
        </View>

        <Text className="font-semibold text-base pl-2.5 mb-3" style={{ color: colors.text }}>
          Informações sobre a placa do veículo
        </Text>

        <View className="gap-4">
          <InputDefault
            control={control}
            name="plate"
            label="Placa"
            placeholder="ABC-1234"
            rules={{ required: "Placa é obrigatória" }}
          />

          <InputDefault
            control={control}
            name="country"
            label="País"
            placeholder="Brasil"
            rules={{ required: "País é obrigatório" }}
          />

          <InputDefault
            control={control}
            name="state"
            label="Estado"
            placeholder="Estado"
            rules={{ required: "Estado é obrigatório" }}
          />

          <InputDefault
            control={control}
            name="city"
            label="Município"
            placeholder="Município"
            rules={{ required: "Município é obrigatório" }}
          />
        </View>

        <View className="mt-8">
          <ButtonDefault title="Confirmar" onPress={handleSubmit(onSubmit)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VehicleData;
