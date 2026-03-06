import { Image, Text, View } from "react-native";
import { maskCpfUltimosCinco } from "@/src/utils/funcoes";
import { useThemeMode } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type HeaderPerfilProps = {
  name?: string;
  image?: string;
  email?: string;
  cpf?: string;
}

export const HeaderPerfil = (props: HeaderPerfilProps) => {
  
  const { mode } = useThemeMode();
  return (
    <View className="flex-row">
      {props.image ? (
        <Image source={{ uri: props.image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      ) : (
        <View className="w-[100px] h-[100px] rounded-full bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
          <Ionicons name="person-outline" size={40} color={mode === "dark" ? "white" : "black"} />
        </View>
      )}

      <View className="ml-4 justify-center">
        <Text className="text-lg font-semibold text-lightText dark:text-darkText">{props.name}</Text>
        <Text className="text-sm text-lightTextSeptenary dark:text-darkTextSeptenary font-semibold">{props.email}</Text>
        <Text className="text-sm text-lightTextSeptenary dark:text-darkTextSeptenary font-semibold">{maskCpfUltimosCinco(String(props.cpf ?? ""))}</Text>
      </View>
    </View>
  );
}