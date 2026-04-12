import React from "react";
import Animated, {
    FadeIn, FadeOut, FadeInDown, FadeInUp,
    FadeOutDown, FadeOutUp, ZoomIn, ZoomOut,
    withSpring, withTiming, Easing,
} from "react-native-reanimated";

const BASE_DURATION = 280;

const iPhoneNotificationEnter = (values: { targetHeight: number }) => {
    "worklet";
    return {
        initialValues: {
            opacity: 0,
            transform: [{ translateY: -(values.targetHeight + 20) }, { scale: 0.94 }],
        },
        animations: {
            opacity: withTiming(1, { duration: 120 }),
            transform: [
                {
                    translateY: withSpring(0, {
                        damping: 26,
                        stiffness: 180,
                        mass: 0.9,
                        overshootClamping: false,
                    }),
                },
                {
                    scale: withSpring(1, {
                        damping: 28,
                        stiffness: 190,
                        mass: 0.8,
                    }),
                },
            ],
        },
    };
};

const iPhoneNotificationExit = (values: { currentHeight: number }) => {
    "worklet";
    return {
        initialValues: {
            opacity: 1,
            transform: [{ translateY: 0 }, { scale: 1 }],
        },
        animations: {
            opacity: withTiming(0, {
                duration: 280,
                easing: Easing.out(Easing.quad),
            }),
            transform: [
                {
                    translateY: withTiming(-(values.currentHeight + 20), {
                        duration: 340,
                        easing: Easing.bezier(0.4, 0, 0.6, 1),
                    }),
                },
                {
                    scale: withTiming(0.92, {
                        duration: 300,
                        easing: Easing.out(Easing.cubic),
                    }),
                },
            ],
        },
    };
};

const appleModalEnter = (values: { targetHeight: number }) => {
    "worklet";
    return {
        initialValues: { opacity: 0, transform: [{ translateY: values.targetHeight }] },
        animations: {
            opacity: withTiming(1, { duration: 280 }),
            transform: [{ translateY: withSpring(0, { damping: 28, stiffness: 180, mass: 0.9 }) }],
        },
    };
};

const appleModalExit = (values: { currentHeight: number }) => {
    "worklet";
    return {
        initialValues: { opacity: 1, transform: [{ translateY: 0 }] },
        animations: {
            opacity: withTiming(0, { duration: 260 }),
            transform: [{
                translateY: withTiming(values.currentHeight, {
                    duration: 340,
                    easing: Easing.in(Easing.cubic),
                }),
            }],
        },
    };
};

export const enter = {
    fade: FadeIn.duration(BASE_DURATION),
    fadeDown: FadeInDown.duration(BASE_DURATION),
    fadeUp: FadeInUp.duration(BASE_DURATION),
    fadeZoomIn: ZoomIn.duration(BASE_DURATION),
    iPhoneBounce: iPhoneNotificationEnter,
    appleModal: appleModalEnter,
};

export const exit = {
    fade: FadeOut.duration(BASE_DURATION),
    fadeDown: FadeOutUp.duration(BASE_DURATION),
    fadeUp: FadeOutDown.duration(BASE_DURATION),
    fadeZoomIn: ZoomOut.duration(BASE_DURATION),
    iPhoneBounce: iPhoneNotificationExit,
    appleModal: appleModalExit,
};

export type AnimatedViewProps = React.ComponentProps<typeof Animated.View>;
type EnterExit = { entering?: any; exiting?: any };

const AnimatedView = Animated.View as unknown as React.ComponentType<AnimatedViewProps & EnterExit>;

export function Fade({ entering = enter.fade, exiting = exit.fade, ...rest }: AnimatedViewProps & EnterExit) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}
export function FadeDown({ entering = enter.fadeDown, exiting = exit.fadeDown, ...rest }: AnimatedViewProps & EnterExit) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}
export function FadeUp({ entering = enter.fadeUp, exiting = exit.fadeUp, ...rest }: AnimatedViewProps & EnterExit) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}
export function FadeZoomIn({ entering = enter.fadeZoomIn, exiting = exit.fadeZoomIn, ...rest }: AnimatedViewProps & EnterExit) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}
export function iPhoneBounceDown({ entering = enter.iPhoneBounce, exiting = exit.iPhoneBounce, ...rest }: AnimatedViewProps & EnterExit) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}
export function appleModal({ entering = enter.appleModal, exiting = exit.appleModal, ...rest }: AnimatedViewProps & EnterExit) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}

const animation = { ...Animated, enter, exit, Fade, FadeDown, FadeUp, FadeZoomIn, iPhoneBounceDown, appleModal };
export default animation;