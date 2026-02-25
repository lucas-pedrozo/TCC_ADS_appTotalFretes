import { View } from "react-native";

type StepIndicatorProps = {
	totalSteps: number;
	currentStep: number;
};

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
	return (
		<View className="flex-row gap-2.5 items-center justify-center py-8">
			{Array.from({ length: totalSteps }).map((_, index) => (
				<View
					key={index}
					className={`w-14 h-2.5 rounded-lg ${index < currentStep ? "bg-green-500" : "bg-gray-500"}`}
				/>
			))}
		</View>
	);
}
