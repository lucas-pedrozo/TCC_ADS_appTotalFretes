import React, { useEffect, useMemo, useRef } from "react";
import {
	View,
	Dimensions,
	ScrollView,
	PanResponder,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMapNavUI } from "@/src/utils/mapControlTheme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SPRING_CONFIG = { damping: 24, stiffness: 220, mass: 0.9 };
const FLOATING_GAP = 10;

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

interface MapNavigationBottomSheetProps {
	visible: boolean;
	collapsedHeight: number;
	expandedHeight: number;
	floatingLeft?: React.ReactNode;
	header: React.ReactNode;
	actions?: React.ReactNode;
	children?: React.ReactNode;
	sheetStyle?: StyleProp<ViewStyle>;
}

export default function MapNavigationBottomSheet({
	visible,
	collapsedHeight,
	expandedHeight,
	floatingLeft,
	header,
	actions,
	children,
	sheetStyle,
}: MapNavigationBottomSheetProps) {
	const insets = useSafeAreaInsets();
	const navUi = useMapNavUI();
	const sheetHeight = useSharedValue(0);
	const dragStartHeightRef = useRef(0);
	const snapCollapsed = collapsedHeight + insets.bottom;
	const snapExpanded = Math.min(expandedHeight + insets.bottom, SCREEN_HEIGHT * 0.72);

	useEffect(() => {
		if (visible) {
			sheetHeight.value = withSpring(snapCollapsed, SPRING_CONFIG);
			return;
		}
		sheetHeight.value = 0;
	}, [visible, snapCollapsed, sheetHeight]);

	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 2,
				onPanResponderGrant: () => {
					dragStartHeightRef.current = sheetHeight.value;
				},
				onPanResponderMove: (_, gesture) => {
					sheetHeight.value = clamp(
						dragStartHeightRef.current - gesture.dy,
						snapCollapsed,
						snapExpanded,
					);
				},
				onPanResponderRelease: (_, gesture) => {
					const currentHeight = sheetHeight.value;
					const midpoint = (snapCollapsed + snapExpanded) / 2;
					const fastUp = gesture.vy < -0.7;
					const fastDown = gesture.vy > 0.7;

					if (fastUp || currentHeight > midpoint) {
						sheetHeight.value = withSpring(snapExpanded, SPRING_CONFIG);
						return;
					}

					if (fastDown || currentHeight < midpoint) {
						sheetHeight.value = withSpring(snapCollapsed, SPRING_CONFIG);
					}
				},
			}),
		[snapCollapsed, snapExpanded, sheetHeight],
	);

	const sheetAnimatedStyle = useAnimatedStyle(() => ({
		height: sheetHeight.value,
	}));

	const floatingAnimatedStyle = useAnimatedStyle(() => ({
		bottom: sheetHeight.value + FLOATING_GAP,
	}));

	if (!visible) return null;

	return (
		<View className="absolute bottom-0 left-0 right-0 z-10" pointerEvents="box-none">
			{floatingLeft ? (
				<Animated.View
					className="absolute left-4 z-[11]"
					style={floatingAnimatedStyle}
					pointerEvents="box-none"
				>
					{floatingLeft}
				</Animated.View>
			) : null}

			<Animated.View
				className="w-full"
				style={[sheetAnimatedStyle, { backgroundColor: navUi.sheetBg }]}
				pointerEvents="box-none"
			>
				<View
					className="flex-1 rounded-t-3xl overflow-hidden shadow-lg"
					style={[
						{ backgroundColor: navUi.sheetBg, paddingBottom: insets.bottom },
						sheetStyle,
					]}
					pointerEvents="auto"
				>
					<View {...panResponder.panHandlers}>
						<View className="items-center pt-2.5 pb-1.5">
							<View
								className="w-10 h-1 rounded-full"
								style={{ backgroundColor: navUi.sheetHandle }}
							/>
						</View>
						{header}
						{actions}
					</View>

					{children ? (
						<ScrollView
							className="flex-1 border-t"
							style={{ borderTopColor: navUi.scrollDivider }}
							contentContainerClassName="px-4 pt-3 pb-4 gap-3"
							showsVerticalScrollIndicator={false}
							nestedScrollEnabled
						>
							{children}
						</ScrollView>
					) : null}
				</View>
			</Animated.View>
		</View>
	);
}
