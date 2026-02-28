import { Image, Text, View } from "react-native";
import { maskCpf } from "@/src/utils/formMask";

type HeaderPerfilProps = {
  name?: string;
  image?: string;
  email?: string;
  cpf?: string;
}

export const HeaderPerfil = (props: HeaderPerfilProps) => {
  return (
    <View className="flex-row">
      {props.image ? (
        <Image source={{ uri: props.image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      ) : (
        <View className="w-[100px] h-[100px] rounded-full bg-lightBgNonary dark:bg-darkBgNonary items-center justify-center">
          <Text className="text-2xl font-bold text-lightText dark:text-darkText">{props.name ? props.name[0] + props.name[1] : "?"}</Text>
        </View>
      )}

      <View className="ml-4 justify-center">
        <Text className="text-lg font-semibold text-lightText dark:text-darkText">{props.name}</Text>
        <Text className="text-sm text-lightTextSeptenary dark:text-darkTextSeptenary font-semibold">{props.email}</Text>
        <Text className="text-sm text-lightTextSeptenary dark:text-darkTextSeptenary font-semibold">{maskCpf(String(props.cpf ?? ""))}</Text>
      </View>
    </View>
  );
}