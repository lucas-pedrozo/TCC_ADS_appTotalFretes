import { View } from "react-native";
import { Option } from "@/src/components/perfil/Option";

const AdvancedOptions = () => {

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 10 }} className="bg-lightBg dark:bg-darkBg">
      <View className="flex-col gap-2.5">
        <Option title="Redefinir Minha Senha" icon="lock-closed-outline" onPress={() => { }} />
        <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
        <Option title="Cancelar Minha Conta" icon="trash-outline" onPress={() => { }} />
        <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
        <Option title="Histórico de Fretes Aceitos" icon="list-outline" onPress={() => { }} />
        <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
        <Option title="Termos de compromisso " icon="document-text-outline" onPress={() => { }} />
        <View className="h-0.5 w-full bg-lightBgNonary dark:bg-darkBgNonary rounded-full" />
      </View>
    </View>
  );
}

export default AdvancedOptions;