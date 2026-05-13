import { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, RefreshControl, Text, View } from "react-native";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { CardFreight } from "@/src/components/cards/CardFreight";
import { InputSearch, ButtonFilter } from "@/src/components/form";
import ModalFilter, { FreightFilterState } from "@/src/components/modal/ModalFilter";
import type { FreightUserMap } from "@/src/interfaces";

const normalizeForSearch = (text: string) =>(text ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

const Freight = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { control, watch } = useForm<{ search: string }>({ defaultValues: { search: "" } });

  const searchTerm = watch("search");
  const [filters, setFilters] = useState<FreightFilterState>({ order: "proximo", value: "todos" });

  const filteredFreights = useMemo(() => {
    let result = [...freights];

    if (filters.value === "menores") {
      result.sort((a, b) => parseFloat((a.freightValue ?? "0").replace(/\./g, "").replace(",", ".")) - parseFloat((b.freightValue ?? "0").replace(/\./g, "").replace(",", ".")));
    } else if (filters.value === "maiores") {
      result.sort((a, b) => parseFloat((b.freightValue ?? "0").replace(/\./g, "").replace(",", ".")) - parseFloat((a.freightValue ?? "0").replace(/\./g, "").replace(",", ".")));
    }

    const term = normalizeForSearch(searchTerm ?? "").trim();
    if (!term) return result;
    return result.filter((item) => {
      const cargoType = normalizeForSearch(item.cargoType ?? "");
      const value = normalizeForSearch(item.freightValue ?? "");
      const origin = normalizeForSearch(item.origin ?? "");
      const destination = normalizeForSearch(item.destination ?? "");
      return (
        cargoType.includes(term) ||
        value.includes(term) ||
        origin.includes(term) ||
        destination.includes(term)
      );
    });
  }, [searchTerm, filters]);

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
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: colors.bg, paddingTop: 10 }}>

      <Text className="text-2xl text-center font-semibold" style={{ color: colors.text }}>
        {t("FREIGHT.TITLE")}
      </Text>

      <View className="h-7" />

      <View className="flex-row items-center gap-2.5 justify-between mb-2">
        <InputSearch
          control={control}
          name="search"
          placeholder={t("FREIGHT.SEARCHPLACEHOLDER")}
        />
        <ButtonFilter onPress={handleOpenFilter} />
      </View>


      <FlatList
        data={filteredFreights}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
        renderItem={({ item }) => (
          <CardFreight
            freight={item as unknown as FreightUserMap}
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
          <Text className="text-center mt-10 text-base" style={{ color: colors.textSecondary }}>
            {t("FREIGHT.EMPTYLIST")}
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

