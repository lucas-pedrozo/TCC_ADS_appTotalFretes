import React from "react";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutUp,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

const BASE_DURATION = 300;

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

export const enter = {
  fade: FadeIn.duration(BASE_DURATION),
  fadeDown: FadeInDown.duration(BASE_DURATION),
  iPhoneBounce: iPhoneNotificationEnter,
};

export const exit = {
  fade: FadeOut.duration(BASE_DURATION),
  fadeDown: FadeOutUp.duration(BASE_DURATION),
  iPhoneBounce: iPhoneNotificationExit,
};

export type AnimatedViewProps = React.ComponentProps<typeof Animated.View>;
type EnterExit = { entering?: any; exiting?: any };

const AnimatedView = Animated.View as unknown as React.ComponentType<
  AnimatedViewProps & EnterExit
>;

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

export function iPhoneBounceDown(
  { entering = enter.iPhoneBounce, exiting = exit.iPhoneBounce, ...rest }: AnimatedViewProps & EnterExit
) {
  return React.createElement(AnimatedView, { entering, exiting, ...rest });
}

const animation = {
  ...Animated,
  enter,
  exit,
  Fade,
  FadeDown,
  iPhoneBounceDown,
};

export default animation;