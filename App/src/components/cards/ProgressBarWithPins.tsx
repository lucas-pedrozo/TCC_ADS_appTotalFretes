import { View } from "react-native";

type ProgressBarWithPinsProps = {
  steps: number;
  currentStep: number;
  isDark: boolean;
}

const PIN_SIZE = 18;
const LINE_HEIGHT = 3;

export function ProgressBarWithPins({ steps, currentStep, isDark }: ProgressBarWithPinsProps) {
  const filledColor = isDark ? "rgba(255, 255, 255, 0.9)" : "#000000";
  const outlineColor = isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.2)";

  return (
    <View className="flex-row items-center w-full mt-5">
      {Array.from({ length: steps }).map((_, index) => {
        const isFilled = index < currentStep;
        const isFirst = index === 0;
        const segmentBeforeFilled = currentStep >= index;
        const segmentAfterFilled = currentStep > index;

        return (
          <View key={index} className="flex-1 flex-row items-center" style={{ minWidth: PIN_SIZE }}>
            {!isFirst && (
              <View
                style={{
                  flex: 1,
                  height: LINE_HEIGHT,
                  borderRadius: 2,
                  backgroundColor: segmentBeforeFilled ? filledColor : outlineColor,
                  marginHorizontal: 2,
                }}
              />
            )}
            <View
              style={{
                width: PIN_SIZE,
                height: PIN_SIZE,
                borderRadius: PIN_SIZE / 2,
                backgroundColor: isFilled ? filledColor : "transparent",
                borderWidth: 2,
                borderColor: isFilled ? filledColor : outlineColor,
              }}
            />
            {index < steps - 1 && (
              <View
                style={{
                  flex: 1,
                  height: LINE_HEIGHT,
                  borderRadius: 2,
                  backgroundColor: segmentAfterFilled ? filledColor : outlineColor,
                  marginHorizontal: 2,
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
