import { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";
import { useThemeColors } from "@/src/context/ThemeContext";

type SkeletonBaseProps = {
	style?: ViewStyle;
};

type SkeletonLineProps = SkeletonBaseProps & { width?: number | string; height?: number };

export function SkeletonLine({ style, width, height = 12 }: SkeletonLineProps) {
	const colors = useThemeColors();
	const opacity = useRef(new Animated.Value(0.4)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, { toValue: 0.7, duration: 600, useNativeDriver: true }),
				Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
			])
		);
		loop.start();
		return () => loop.stop();
	}, [opacity]);

	return (
		<Animated.View
			style={[
				{
					height,
					flex: width === undefined ? 1 : undefined,
					width: typeof width === "number" ? width : undefined,
					borderRadius: 6,
					backgroundColor: colors.bgTertiary,
					opacity,
				},
				style,
			]}
		/>
	);
}

export function SkeletonCircle({ size = 48, style }: SkeletonBaseProps & { size?: number }) {
	const colors = useThemeColors();
	const opacity = useRef(new Animated.Value(0.4)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, { toValue: 0.7, duration: 600, useNativeDriver: true }),
				Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
			])
		);
		loop.start();
		return () => loop.stop();
	}, [opacity]);

	return (
		<Animated.View
			style={[
				{
					width: size,
					height: size,
					borderRadius: size / 2,
					backgroundColor: colors.bgTertiary,
					opacity,
				},
				style,
			]}
		/>
	);
}

export function SkeletonBox({ width, height = 80, style }: SkeletonBaseProps & { width?: number | string; height?: number }) {
	const colors = useThemeColors();
	const opacity = useRef(new Animated.Value(0.4)).current;

	useEffect(() => {
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, { toValue: 0.7, duration: 600, useNativeDriver: true }),
				Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
			])
		);
		loop.start();
		return () => loop.stop();
	}, [opacity]);

	return (
		<Animated.View
			style={[
				{
					width: width ?? "100%",
					height,
					borderRadius: 12,
					backgroundColor: colors.bgTertiary,
					opacity,
				},
				style,
			]}
		/>
	);
}
