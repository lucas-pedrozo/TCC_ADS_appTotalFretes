import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, View, } from "react-native"

import { useForm } from "react-hook-form";
import { useThemeMode } from "@/src/context/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { InputSearch } from "@/src/components/fom/inputs/InputSearch";
import { ButtonFilter } from "@/src/components/fom/buttons/ButtonFilter";

const Freight = () => {
  const { mode } = useThemeMode();
  const { control } = useForm();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-lightBg dark:bg-darkBg">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={mode === "dark" ? "#FFFFFF" : "#000000"}
          />
        }
      >
        <Text className="text-lightText dark:text-darkText text-2xl text-center font-semibold">
          Fretes Disponiveis
        </Text>

        <View className="flex-row items-center gap-2.5 justify-between mt-4 mb-2">
          <InputSearch
            control={control}
            name="search"
            placeholder="Buscar frete"
            rules={{
              required: "Buscar frete é obrigatório",
              minLength: {
                value: 3,
                message: "Buscar frete deve ter no mínimo 3 caracteres",
              },
            }}
          />
          <ButtonFilter/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Freight;