import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useIconColor } from "@/src/context/ThemeContext";
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
    className={`px-3 py-1.5 rounded-xl ${active ? "bg-lightBgQuaternary dark:bg-darkBgQuaternary" : "bg-lightBgSecondary dark:bg-darkBgSecondary"}`}
  >
    <Text className={`font-medium ${active ? "text-lightTextTertiary dark:text-darkTextTertiary" : "text-lightText dark:text-darkText"}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ModalFilter = ({ visible, onClose, onApply, currentCity, filters, onChangeFilters }: ModalFilterProps) => {
  const { t } = useTranslation();
  const iconColor = useIconColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <animation.FadeDown className="flex-1 bg-black/30 justify-start px-4 pt-28">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="w-full p-2.5 rounded-2xl bg-lightBgSecondary dark:bg-darkBgSecondary border border-lightBgTertiary dark:border-darkBgTertiary">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lightText dark:text-darkText font-semibold text-base">
              {t("MODALFILTER.TITLE")}
            </Text>
            <TouchableOpacity onPress={onClose} className="bg-lightBgNonary dark:bg-darkBgTertiary rounded-md p-1.5">
              <Ionicons name="close" size={20} color="#ff0000" />
            </TouchableOpacity>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-semibold text-base">
                {t("MODALFILTER.ORDER")}:
              </Text>
              <FilterChip
                label={t("MODALFILTER.NEARBY")}
                active={filters.order === "proximo"}
                onPress={() => onChangeFilters({ ...filters, order: "proximo" })}
              />
              <FilterChip
                label={t("MODALFILTER.FAR")}
                active={filters.order === "longe"}
                onPress={() => onChangeFilters({ ...filters, order: "longe" })}
              />
            </View>

            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-semibold text-base">
                {t("MODALFILTER.VALUE")}:
              </Text>
              <FilterChip
                label={t("MODALFILTER.ALL")}
                active={filters.value === "todos"}
                onPress={() => onChangeFilters({ ...filters, value: "todos" })}
              />
              <FilterChip
                label={t("MODALFILTER.LOWER")}
                active={filters.value === "menores"}
                onPress={() => onChangeFilters({ ...filters, value: "menores" })}
              />
              <FilterChip
                label={t("MODALFILTER.HIGHER")}
                active={filters.value === "maiores"}
                onPress={() => onChangeFilters({ ...filters, value: "maiores" })}
              />
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-semibold text-base">
                {t("MODALFILTER.CURRENTCITY")}: {currentCity}
              </Text>
              <TouchableOpacity
                onPress={onApply}
                className="bg-lightBgQuaternary dark:bg-darkBgQuaternary rounded-xl px-4 py-2"
              >
                <Text className="text-lightTextTertiary dark:text-darkTextTertiary font-semibold text-base">
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
