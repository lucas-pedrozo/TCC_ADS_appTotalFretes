import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import animation from "@/src/utils/animation";

export type FreightFilterState = {
  order: "proximo" | "longe";
  value: "todos" | "menores" | "maiores";
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

const ModalFilter = (props: ModalFilterProps) => {
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="none"
      onRequestClose={props.onClose}
    >
      <animation.FadeDown className="flex-1 bg-black/30 justify-start px-4 pt-28">
        <Pressable className="absolute inset-0" onPress={props.onClose} />

        <View className="w-full p-2.5 rounded-2xl bg-darkBgSecondary border border-darkBgTertiary">
          
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-darkText font-semibold text-base">Filtro de Fretes</Text>
            <TouchableOpacity onPress={props.onClose} className="bg-darkBgTertiary rounded-md p-1.5">
              <Ionicons name="close" size={20} color="#ff0000" />
            </TouchableOpacity>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-darkTextSecondary font-semibold text-base">Ordem:</Text>
              <FilterChip
                label="Proximo"
                active={props.filters.order === "proximo"}
                onPress={() => props.onChangeFilters({ ...props.filters, order: "proximo" })}
              />
              <FilterChip
                label="Longe"
                active={props.filters.order === "longe"}
                onPress={() => props.onChangeFilters({ ...props.filters, order: "longe" })}
              />
            </View>

            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-darkTextSecondary font-semibold text-base">Valor:</Text>
              <FilterChip 
                label="Todos"
                active={props.filters.value === "todos"}
                onPress={() => props.onChangeFilters({ ...props.filters, value: "todos" })}
              />
              <FilterChip
                label="Menores"
                active={props.filters.value === "menores"}
                onPress={() => props.onChangeFilters({ ...props.filters, value: "menores" })}
              />
              <FilterChip
                label="Maiores"
                active={props.filters.value === "maiores"}
                onPress={() => props.onChangeFilters({ ...props.filters, value: "maiores" })}
              />
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-darkTextSecondary font-semibold text-base">
                Cidade Atual: {props.currentCity}
              </Text>
              <TouchableOpacity
                onPress={props.onApply}
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