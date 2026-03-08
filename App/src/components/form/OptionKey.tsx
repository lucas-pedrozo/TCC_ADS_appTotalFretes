import { Ionicons } from "@expo/vector-icons";
import { View, Text, Switch } from "react-native";
import { useThemeColors, useThemeMode } from "@/src/context/ThemeContext";
import { IconBox } from "@/src/components/ui/IconBox";

type OptionKeyProps = {
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  value?: boolean;
  setValue?: (value: boolean) => void;
};

export function OptionKey({ title, icon, value, setValue }: OptionKeyProps) {
  const colors = useThemeColors();
  const { mode } = useThemeMode();

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center justify-center gap-2.5">
        {icon && <IconBox name={icon} />}
        <Text className="font-semibold text-base" style={{ color: colors.text }}>{title}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={(val) => { if (setValue) setValue(val); }}
        trackColor={{ false: "#767577", true: "#00FF44" }}
        thumbColor="#f4f3f4"
        ios_backgroundColor="#3e3e3e"
        style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
      />
    </View>
  );
}
