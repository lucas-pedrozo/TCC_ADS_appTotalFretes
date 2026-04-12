import http from "@/src/services/http";
import { useRegisterVehicleContext, VehicleGroupType } from "@/src/context/RegisterVehicleContext";
import { useForm } from "react-hook-form";
import { useAlertDefault } from "@/src/context/AlertDefaultContext";
import { AxiosError } from "axios";
import i18n from "@/src/i18n";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Routes";

interface RegisterVehicleFormData {
  model: string;
  mark: string;
  chassisNumber: string;
  size: string;
  plate: string;
  country: string;
  state: string;
  city: string;
  axle: number;
  weight: number;
  group: VehicleGroupType;
}

export function useRegisterVehicle() {
  const { notify } = useAlertDefault();
  const { vehicleType } = useRegisterVehicleContext();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterVehicleFormData>({ mode: "onSubmit", });

  const handleRegisterVehicle = async (data: RegisterVehicleFormData) => {
    if (!vehicleType?.id) {
      notify({
        status: "error",
        message: "Selecione o tipo de veículo antes de continuar.",
      });
      return;
    }

    try {
      await notify({
        status: "loading",
        message: i18n.t("NOTIFICATIONS.REGISTERVEHICLELOADING"),
      });

      await http.post("vehicle/register", {
        plateNumber: data.plate.replace(/[^A-Za-z0-9]/g, "").toUpperCase(),
        chassisNumber: (data.chassisNumber ?? "").replace(/\s/g, "").toUpperCase(),
        model: data.model?.trim() ?? "",
        mark: data.mark?.trim() ?? "",
        city: data.city?.trim() ?? "",
        stateUF: data.state?.trim() ?? "",
        country: data.country?.trim() ?? "",
        vehicleType_id: vehicleType.id,
      });

      await notify({
        status: "success",
        message: i18n.t("NOTIFICATIONS.REGISTERVEHICLESUCCESS"),
      });

      navigation.navigate("Home");
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data?.message ?? "";
      if (message) {
        notify({ status: "error", message });
      }
    }
  };

  const rules = {
    plate: { required: "Placa é obrigatória" },
    chassisNumber: { required: "Chassi é obrigatório" },
    model: { required: "Modelo é obrigatório" },
    mark: { required: "Marca é obrigatória" },
    country: { required: "País é obrigatório" },
    state: { required: "Estado é obrigatório" },
    city: { required: "Cidade é obrigatória" },
    size: { required: "Tamanho é obrigatório" },
  };

  return {
    handleRegisterVehicle,
    rules,
    control,
    handleSubmit,
    errors,
  };
}
