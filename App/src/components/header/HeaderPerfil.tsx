import { Image, Text, View } from "react-native";
import { formatNameSobrenome, maskCpfUltimosCinco } from "@/src/utils/format";
import { useIconColor } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type HeaderPerfilProps = {
  name?: string;
  image?: string;
  email?: string;
  cpf?: string;
};

export const HeaderPerfil = ({ name, image, email, cpf }: HeaderPerfilProps) => {
  const iconColor = useIconColor();

  return (
    <View className="flex-row">
      {image ? (
        <Image source={{ uri: image }} className="w-[100px] h-[100px] rounded-full" />
      ) : (
        <View className="w-[100px] h-[100px] rounded-full bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
          <Ionicons name="person-outline" size={40} color={iconColor} />
        </View>
      )}

      <View className="ml-4 justify-center">
        <Text className="text-lg font-semibold text-lightText dark:text-darkText">{formatNameSobrenome(name ?? "")}</Text>
        <Text className="text-sm text-lightTextSeptenary dark:text-darkTextSeptenary font-semibold">{email}</Text>
        <Text className="text-sm text-lightTextSeptenary dark:text-darkTextSeptenary font-semibold">
          {maskCpfUltimosCinco(String(cpf ?? ""))}
        </Text>
      </View>
    </View>
  );
};
