import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/src/context/ThemeContext";
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

const FilterChip = ({ label, active, onPress, colors }: FilterChipProps & { colors: ReturnType<typeof useThemeColors> }) => (
  <TouchableOpacity
    onPress={onPress}
    className="px-3 py-1.5 rounded-xl"
    style={{ backgroundColor: active ? colors.bgQuaternary : colors.bgSecondary }}
  >
    <Text className="font-medium" style={{ color: active ? colors.textTertiary : colors.text }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ModalFilter = ({ visible, onClose, onApply, currentCity, filters, onChangeFilters }: ModalFilterProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <animation.FadeDown className="flex-1 bg-black/30 justify-start px-4 pt-28">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full p-2.5 rounded-2xl" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1 }}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-semibold text-base" style={{ color: colors.text }}>
              {t("MODALFILTER.TITLE")}
            </Text>
            <TouchableOpacity onPress={onClose} className="rounded-md p-1.5" style={{ backgroundColor: colors.bgTertiary }}>
              <Ionicons name="close" size={20} color="#ff0000" />
            </TouchableOpacity>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="font-semibold text-base" style={{ color: colors.textSecondary }}>
                {t("MODALFILTER.ORDER")}:
              </Text>
              <FilterChip
                label={t("MODALFILTER.NEARBY")}
                active={filters.order === "proximo"}
                onPress={() => onChangeFilters({ ...filters, order: "proximo" })}
                colors={colors}
              />
              <FilterChip
                label={t("MODALFILTER.FAR")}
                active={filters.order === "longe"}
                onPress={() => onChangeFilters({ ...filters, order: "longe" })}
                colors={colors}
              />
            </View>

            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="font-semibold text-base" style={{ color: colors.textSecondary }}>
                {t("MODALFILTER.VALUE")}:
              </Text>
              <FilterChip
                label={t("MODALFILTER.ALL")}
                active={filters.value === "todos"}
                onPress={() => onChangeFilters({ ...filters, value: "todos" })}
                colors={colors}
              />
              <FilterChip
                label={t("MODALFILTER.LOWER")}
                active={filters.value === "menores"}
                onPress={() => onChangeFilters({ ...filters, value: "menores" })}
                colors={colors}
              />
              <FilterChip
                label={t("MODALFILTER.HIGHER")}
                active={filters.value === "maiores"}
                onPress={() => onChangeFilters({ ...filters, value: "maiores" })}
                colors={colors}
              />
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <Text className="font-semibold text-base" style={{ color: colors.textSecondary }}>
                {t("MODALFILTER.CURRENTCITY")}: {currentCity}
              </Text>
              <TouchableOpacity
                onPress={onApply}
                className="rounded-xl px-4 py-2"
                style={{ backgroundColor: colors.bgQuaternary }}
              >
                <Text className="font-semibold text-base" style={{ color: colors.textTertiary }}>
                  {t("MODALFILTER.APPLY")}
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
