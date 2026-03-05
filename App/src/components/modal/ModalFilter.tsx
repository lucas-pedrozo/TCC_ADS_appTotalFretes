import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import animation from "@/src/utils/animation";

export type FreightFilterState = {
  order: "proximo" | "longe";
  distance: "50km" | "100km" | "200km";
  value: "todos" | "100" | "200";
};

interface ModalFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  currentCity: string;
  filters: FreightFilterState;
  onChangeFilters: (filters: FreightFilterState) => void;
}

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const FilterChip = ({ label, active, onPress }: FilterChipProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-3 py-1.5 rounded-xl ${active ? "bg-lightBgQuaternary" : "bg-lightBgSecondary"}`}
  >
    <Text className={`font-medium ${active ? "text-lightTextTertiary" : "text-lightText"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ModalFilter = ({
  visible,
  onClose,
  onApply,
  currentCity,
  filters,
  onChangeFilters,
}: ModalFilterProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <animation.FadeDown className="flex-1 bg-black/30 justify-start px-4 pt-28">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full p-2.5 rounded-2xl bg-darkBgSecondary border border-darkBgTertiary">
          
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-darkText font-semibold text-base">Filtro de Fretes</Text>
            <TouchableOpacity onPress={onClose} className="bg-darkBgTertiary rounded-md p-1.5">
              <Ionicons name="close" size={20} color="#ff0000" />
            </TouchableOpacity>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-darkTextSecondary font-semibold text-base">Ordem:</Text>
              <FilterChip
                label="Proximo"
                active={filters.order === "proximo"}
                onPress={() => onChangeFilters({ ...filters, order: "proximo" })}
              />
              <FilterChip
                label="Longe"
                active={filters.order === "longe"}
                onPress={() => onChangeFilters({ ...filters, order: "longe" })}
              />
            </View>

            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-darkTextSecondary font-semibold text-base">Distancia:</Text>
              <FilterChip
                label="50km"
                active={filters.distance === "50km"}
                onPress={() => onChangeFilters({ ...filters, distance: "50km" })}
              />
              <FilterChip
                label="100km"
                active={filters.distance === "100km"}
                onPress={() => onChangeFilters({ ...filters, distance: "100km" })}
              />
              <FilterChip
                label="200km"
                active={filters.distance === "200km"}
                onPress={() => onChangeFilters({ ...filters, distance: "200km" })}
              />
            </View>

            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-darkTextSecondary font-semibold text-base">Valor:</Text>
              <FilterChip
                label="Todos"
                active={filters.value === "todos"}
                onPress={() => onChangeFilters({ ...filters, value: "todos" })}
              />
              <FilterChip
                label="100km"
                active={filters.value === "100"}
                onPress={() => onChangeFilters({ ...filters, value: "100" })}
              />
              <FilterChip
                label="200km"
                active={filters.value === "200"}
                onPress={() => onChangeFilters({ ...filters, value: "200" })}
              />
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-darkTextSecondary font-semibold text-base">
                Cidade Atual: {currentCity}
              </Text>
              <TouchableOpacity
                onPress={onApply}
                className="bg-lightBgPrimary dark:bg-darkBgPrimary rounded-xl px-4 py-2"
              >
                <Text className="text-lightText bg-[#74AEF1] rounded-lg px-2 py-1 font-semibold text-base">
                  Atualizar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </animation.FadeDown>
    </Modal>
  );
};

export default ModalFilter;