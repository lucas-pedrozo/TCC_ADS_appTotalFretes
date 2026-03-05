import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useThemeMode } from "@/src/context/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { FlatList, RefreshControl, Text, View, } from "react-native"
import { InputSearch } from "@/src/components/fom/inputs/InputSearch";
import { ButtonFilter } from "@/src/components/fom/buttons/ButtonFilter";
import ModalFilter, { FreightFilterState } from "@/src/components/modal/ModalFilter";
import { CardFreight } from "@/src/components/cards/CardFreight";

const Freight = () => {

  const { control } = useForm();
  const { mode } = useThemeMode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState<FreightFilterState>({ order: "proximo", distance: "50km", value: "todos", });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleOpenFilter = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  const handleApplyFilter = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }} className="bg-lightBg dark:bg-darkBg">

      <Text className="text-lightText dark:text-darkText text-2xl text-center font-semibold">
        Fretes Disponiveis
      </Text>

      <View className="flex-row items-center gap-2.5 justify-between mt-4 mb-2">
        <InputSearch
          control={control}
          name="search"
          placeholder="Buscar frete"
          rules={{ required: 'dsda' }}
        />
        <ButtonFilter onPress={handleOpenFilter} />
      </View>


      <FlatList
        data={freights}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
        renderItem={({ item }) => (
          <CardFreight
            name={item.name || "Não informado"}
            origin={item.origin || "Não informado"}
            destination={item.destination || "Não informado"}
            cargoType={item.cargoType || "Nenhum"}
            cargoWeight={item.cargoWeight || "N/A"}
            freightValue={item.freightValue || "N/A"}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={mode === "dark" ? "#FFFFFF" : "#000000"}
          />
        }
        ListEmptyComponent={
          <Text className="text-lightTextSecondary dark:text-darkTextSecondary text-center mt-10 text-base">
            Nenhum frete encontrado.
          </Text>
        }
      />

      <ModalFilter
        visible={showFilterModal}
        onClose={handleCloseFilter}
        onApply={handleApplyFilter}
        currentCity="Juranda Pr"
        filters={filters}
        onChangeFilters={setFilters}
      />
    </SafeAreaView>
  )
}

export default Freight;

const freights = [
  {
    id: "1",
    name: "Reboque Caçamba",
    origin: "Belo Horizonte - MG",
    destination: "Contagem - MG",
    cargoType: "Cascalho",
    cargoWeight: "20T",
    freightValue: "1.500,00",
  },
  {
    id: "2",
    name: "Bitrem Graneleiro",
    origin: "Curitiba - PR",
    destination: "Ponta Grossa - PR",
    cargoType: "Soja",
    cargoWeight: "32T",
    freightValue: "2.300,00",
  },
];