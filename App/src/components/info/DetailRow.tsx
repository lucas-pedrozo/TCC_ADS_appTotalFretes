import { Text, View } from "react-native";

type DetailRowProps = {
    label: string;
    value: string;
}

export const DetailRow = ({ label, value }: DetailRowProps) => {
    return (
      <View className="flex-row justify-between mb-2.5">
        <Text className="text-lightTextSecondary dark:text-darkTextSecondary">
          {label}
        </Text>
        <Text className="font-medium text-lightText dark:text-darkText">
          {value}
        </Text>
      </View>
    );
}