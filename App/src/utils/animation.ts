import React from "react";
import Animated, {
    FadeIn,
    FadeOut,
    FadeInDown,
    FadeInUp,
    FadeOutDown,
    FadeOutUp,
    ZoomIn,
    ZoomOut,
    withSpring,
    withTiming,
    Easing,
} from "react-native-reanimated";

const BASE_DURATION = 300;

/**
 * @description Animacao de entrada do iPhone notification
 * @param values Valores da animacao
 * @returns Objeto com as animacoes
 */
const iPhoneNotificationEnter = (values: { targetHeight: number }) => {
    "worklet";
    return {
        initialValues: {
            opacity: 0,
            transform: [{ translateY: -values.targetHeight }],
        },
        animations: {
            opacity: withTiming(1, { duration: 120 }),
            transform: [
                {
                    translateY: withSpring(
                        0,
                        {
                            damping: 10,
                            stiffness: 120,
                            mass: 0.7,
                            overshootClamping: false,
                        }
                    ),
                },
            ],
        },
    };
};

/**
 * @description Animacao de saida do iPhone notification
 * @param values Valores da animacao
 * @returns Objeto com as animacoes
 */
const iPhoneNotificationExit = (values: { currentHeight: number }) => {
    "worklet";
    return {
        initialValues: {
            opacity: 1,
            transform: [{ translateY: 0 }],
        },
        animations: {
            opacity: withTiming(0, { duration: 120 }),
            transform: [
                {
                    translateY: withTiming(-values.currentHeight, {
                        duration: 220,
                        easing: Easing.out(Easing.cubic),
                    }),
                },
            ],
        },
    };
};

/**
 * @description Animacao de entrada para modal estilo Apple
 * @param values Valores da animacao
 * @returns Objeto com as animacoes
 */
const appleModalEnter = (values: { targetHeight: number }) => {
    "worklet";
    return {
        initialValues: {
            opacity: 0,
            transform: [{ translateY: values.targetHeight }],
        },
        animations: {
            opacity: withTiming(1, { duration: 200 }),
            transform: [
                {
                    translateY: withSpring(
                        0,
                    ),
                },
            ],
        },
    };
};

/**
 * @description Animacao de saida para modal estilo Apple
 * @param values Valores da animacao
 * @returns Objeto com as animacoes
 */
const appleModalExit = (values: { currentHeight: number }) => {
    "worklet";
    return {
        initialValues: {
            opacity: 1,
            transform: [{ translateY: 0 }],
        },
        animations: {
            opacity: withTiming(0, { duration: 150 }),
            transform: [
                {
                    translateY: withTiming(values.currentHeight, {
                        duration: 250,
                        easing: Easing.in(Easing.cubic),
                    }),
                },
            ],
        },
    };
};

/**
 * @description Objeto com as animacoes de entrada
 * @returns Objeto com as animacoes
 */
export const enter = {
    fade: FadeIn.duration(BASE_DURATION),
    fadeDown: FadeInDown.duration(BASE_DURATION),
    fadeUp: FadeInUp.duration(BASE_DURATION),
    fadeZoomIn: ZoomIn.duration(BASE_DURATION),
    iPhoneBounce: iPhoneNotificationEnter,
    appleModal: appleModalEnter,
};

/**
 * @description Objeto com as animacoes de saida
 * @returns Objeto com as animacoes
 */
export const exit = {
    fade: FadeOut.duration(BASE_DURATION),
    fadeDown: FadeOutUp.duration(BASE_DURATION),
    fadeUp: FadeOutDown.duration(BASE_DURATION),
    fadeZoomIn: ZoomOut.duration(BASE_DURATION),
    iPhoneBounce: iPhoneNotificationExit,
    appleModal: appleModalExit,
};

/**
 * @description Tipo de props para o componente Animated.View
 * @returns Tipo de props para o componente Animated.View
 */
export type AnimatedViewProps = React.ComponentProps<typeof Animated.View>;
type EnterExit = { entering?: any; exiting?: any };

const AnimatedView = Animated.View as unknown as React.ComponentType<
    AnimatedViewProps & EnterExit
>;

/**
 * @description Componente de animacao de fade
 * @param entering Animacao de entrada
 * @param exiting Animacao de saida
 * @param rest Resto das props
 * @returns Componente de animacao de fade
 */
export function Fade(
    { entering = enter.fade, exiting = exit.fade, ...rest }: AnimatedViewProps & EnterExit
) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}

export function FadeDown(
    { entering = enter.fadeDown, exiting = exit.fadeDown, ...rest }: AnimatedViewProps & EnterExit
) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}

export function FadeUp(
    { entering = enter.fadeUp, exiting = exit.fadeUp, ...rest }: AnimatedViewProps & EnterExit
) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}

export function FadeZoomIn(
    { entering = enter.fadeZoomIn, exiting = exit.fadeZoomIn, ...rest }: AnimatedViewProps & EnterExit
) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}

export function iPhoneBounceDown(
    { entering = enter.iPhoneBounce, exiting = exit.iPhoneBounce, ...rest }: AnimatedViewProps & EnterExit
) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}

export function appleModal(
    { entering = enter.appleModal, exiting = exit.appleModal, ...rest }: AnimatedViewProps & EnterExit
) {
    return React.createElement(AnimatedView, { entering, exiting, ...rest });
}

const animation = {
    ...Animated,
    enter,
    exit,
    Fade,
    FadeDown,
    FadeUp,
    FadeZoomIn,
    iPhoneBounceDown,
    appleModal,
};

export default animation;