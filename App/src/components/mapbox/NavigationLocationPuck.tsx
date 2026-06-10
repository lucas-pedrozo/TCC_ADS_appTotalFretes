import React, { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withTiming,
} from "react-native-reanimated";

const GOOGLE_NAV_BLUE = "#1A73E8";
const PULSE_DURATION_MS = 1800;

type NavigationLocationPuckProps = {
	size?: number;
};

function PulseRing({ delayMs, maxSize }: { delayMs: number; maxSize: number }) {
	const progress = useSharedValue(0);

	useEffect(() => {
		progress.value = withDelay(
			delayMs,
			withRepeat(
				withTiming(1, { duration: PULSE_DURATION_MS, easing: Easing.out(Easing.ease) }),
				-1,
				false,
			),
		);
	}, [delayMs, progress]);

	const ringStyle = useAnimatedStyle(() => {
		const scale = 0.45 + progress.value * 0.95;
		const opacity = (1 - progress.value) * 0.42;
		return {
			opacity,
			transform: [{ scale }],
		};
	});

	return (
		<Animated.View
			pointerEvents="none"
			style={[
				{
					position: "absolute",
					width: maxSize,
					height: maxSize,
					borderRadius: maxSize / 2,
					backgroundColor: GOOGLE_NAV_BLUE,
				},
				ringStyle,
			]}
		/>
	);
}

/**
 * Marcador de posição estilo Google Maps: ponto azul com pulso animado.
 */
export const NavigationLocationPuck = memo(function NavigationLocationPuck({
	size = 48,
}: NavigationLocationPuckProps) {
	const dotSize = Math.round(size * 0.34);
	const haloSize = Math.round(size * 0.52);

	return (
		<View
			className="items-center justify-center"
			style={{ width: size, height: size }}
			pointerEvents="none"
			collapsable={false}
		>
			<PulseRing delayMs={0} maxSize={size} />
			<PulseRing delayMs={PULSE_DURATION_MS / 2} maxSize={size} />

			<View
				style={{
					position: "absolute",
					width: haloSize,
					height: haloSize,
					borderRadius: haloSize / 2,
					backgroundColor: "#FFFFFF",
					borderWidth: 2,
					borderColor: "rgba(255, 255, 255, 0.95)",
					shadowColor: GOOGLE_NAV_BLUE,
					shadowOffset: { width: 0, height: 0 },
					shadowOpacity: 0.35,
					shadowRadius: 6,
					elevation: 6,
				}}
			/>

			<View
				style={{
					position: "absolute",
					width: dotSize,
					height: dotSize,
					borderRadius: dotSize / 2,
					backgroundColor: GOOGLE_NAV_BLUE,
					borderWidth: 2,
					borderColor: "#FFFFFF",
				}}
			/>
		</View>
	);
});
