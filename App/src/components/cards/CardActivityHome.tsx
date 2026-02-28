import { Ionicons } from "@expo/vector-icons"
import { useThemeMode } from "@/src/context/ThemeContext";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native"

export const CardActivityHome = () => {
  const { mode } = useThemeMode();

  return (
    <>
      <View className="flex-row justify-between items-center pt-5 pb-2.5 px-2.5">
        <Text className="text-lightText dark:text-darkText font-semibold text-lg">Minha Atividades Atual</Text>

        <TouchableOpacity className="w-12 h-12 rounded-xl bg-lightBgTertiary dark:bg-darkBgTertiary items-center justify-center">
          <Ionicons name="chevron-forward-outline" size={24} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="p-4 bg-lightBgSecondary dark:bg-darkBgSecondary rounded-2xl w-full">

        <View className="flex-row items-center gap-2.5">
          <View className="w-12 h-12 rounded-xl bg-lightBgTertiary dark:bg-darkBgTertiary items-center justify-center">
            <Ionicons name="cube" size={26} color={mode === "dark" ? "#FFFFFF" : "#000000"} />
          </View>
          <Text className="text-lightText dark:text-darkText font-semibold text-base">Minha atividade Atual</Text>
        </View>

        <View className="flex-row justify-between pt-2.5 w-full">
          <Text className="text-lightText dark:text-darkText font-semibold text-base">Não informado</Text>
          <Text className="text-lightText dark:text-darkText font-semibold text-base truncate">
            N/A
            <Text className="text-lightTextSecondary dark:text-darkTextSecondary font-semibold text-base"> / N/A T</Text>
          </Text>
        </View>

        <View className="flex-row justify-between pt-2.5 w-full">

          <View className="flex-col w-[50%]">
            <Text className="text-lightText dark:text-darkText text-sm break-words">Origem: N/A</Text>
            <Text className="text-lightText dark:text-darkText text-sm break-words">Destino: N/A</Text>
          </View>
          <View className="flex-col items-end w-[50%]">
            <Text className="text-lightText dark:text-darkText text-sm text-end">Status: N/A</Text>
            <Text className="text-lightText dark:text-darkText text-sm text-end">Prazo: N/A</Text>
          </View>

        </View>

        <ProgressBarWithMarkers steps={5} currentStep={0} />
      </TouchableOpacity>
    </>
  )
}



interface ProgressBarWithMarkersProps {
  steps: number;
  currentStep: number;
}

const ProgressBarWithMarkers: React.FC<ProgressBarWithMarkersProps> = ({
  steps,
  currentStep,
}) => {
  const markers = Array.from({ length: steps }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      <View style={styles.markersContainer}>
        {markers.map((step) => (
          <Ionicons
            key={step}
            name="location"
            size={24}
            color={step <= currentStep ? "#00FF00" : "#B0B0B0"}
          />
        ))}
      </View>
      <View style={styles.progressBarContainer}>
        {markers.map((step) => (
          <View
            key={step}
            style={{
              ...styles.segment,
              backgroundColor: step <= currentStep ? "#00FF00" : "#B0B0B0",
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  progressBarContainer: {
    flexDirection: "row",
    width: "100%",
    height: 12,
    padding: 2,
    backgroundColor: "#B0B0B0",
    borderRadius: 10,
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    height: "100%",
    marginHorizontal: 2,
    borderRadius: 5,
  },
  markersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
});