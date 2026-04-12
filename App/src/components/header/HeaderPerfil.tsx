import { Image,Text, View } from "react-native";
import { formatNameSobrenome, maskCpfUltimosCinco } from "@/src/utils/format";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type HeaderPerfilProps = {
  name?: string;
  image?: string;
  email?: string;
  cpf?: string;
};

export const HeaderPerfil = ({ name, image, email, cpf }: HeaderPerfilProps) => {
  const colors = useThemeColors();
  const iconColor = useIconColor();

  return (
    <View className="flex-row">
      <View className="w-[100px] h-[100px] rounded-full items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
        {image ? (
          <Image source={{ uri: image }} className="w-[100px] h-[100px] rounded-full" />
        ) : (
          <View className="w-[100px] h-[100px] rounded-full items-center justify-center" style={{ backgroundColor: colors.bgNonary }}>
            <Ionicons name="person-outline" size={40} color={iconColor} />
          </View>
        )}
      </View>

      <View className="ml-4 justify-center">
        <Text className="text-lg font-semibold" style={{ color: colors.text }}>{formatNameSobrenome(name ?? "")}</Text>
        <Text className="text-sm font-semibold" style={{ color: colors.textSeptenary }}>{email}</Text>
        <Text className="text-sm font-semibold" style={{ color: colors.textSeptenary }}>{maskCpfUltimosCinco(String(cpf ?? ""))}</Text>
      </View>
    </View>
  );
};
