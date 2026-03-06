import { TouchableOpacity, Text } from "react-native";

export type ButtonOutlineProps = {
  title: string;
  onPress: () => void;
};

export function ButtonOutline({ title, onPress }: ButtonOutlineProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-24 bg-lightBgNonary dark:bg-darkBgNonary p-2 rounded-xl border border-lightBgTertiary dark:border-darkBgTertiary"
    >
      <Text className="text-lightText dark:text-darkText text-center text-sm">{title}</Text>
    </TouchableOpacity>
  );
}
