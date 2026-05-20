import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { MotionSpring, MotionStagger } from '@/constants/motion';

type FadeInViewProps = {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  from?: 'down' | 'up' | 'fade';
  style?: StyleProp<ViewStyle>;
};

export function FadeInView({
  children,
  index = 0,
  delay = 0,
  from = 'down',
  style,
}: FadeInViewProps) {
  const totalDelay = delay + index * MotionStagger.item;
  const spring = MotionSpring.gentle;

  const entering =
    from === 'up'
      ? FadeInUp.delay(totalDelay).springify().damping(spring.damping).stiffness(spring.stiffness)
      : from === 'fade'
        ? FadeIn.delay(totalDelay).duration(400)
        : FadeInDown.delay(totalDelay)
            .springify()
            .damping(spring.damping)
            .stiffness(spring.stiffness);

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

type ScalePressableProps = PressableProps & {
  children: React.ReactNode;
  scale?: number;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function ScalePressable({
  children,
  scale = 0.96,
  haptic = true,
  style,
  contentStyle,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: ScalePressableProps) {
  const pressed = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressed.value }],
  }));

  return (
    <Pressable
      {...rest}
      style={style}
      onPress={(e) => {
        if (haptic && process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(e);
      }}
      onPressIn={(e) => {
        pressed.value = withSpring(scale, MotionSpring.snappy);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = withSpring(1, MotionSpring.snappy);
        onPressOut?.(e);
      }}>
      <Animated.View style={[animatedStyle, contentStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

type PopInViewProps = {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function PopInView({ children, delay = 0, style }: PopInViewProps) {
  return (
    <Animated.View
      entering={ZoomIn.delay(delay).springify().damping(MotionSpring.bouncy.damping).stiffness(200)}
      style={style}>
      {children}
    </Animated.View>
  );
}

type PulseViewProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Subtle breathing scale for badges / success icons */
export function PulseView({ children, style }: PulseViewProps) {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    const loop = () => {
      pulse.value = withSpring(1.04, MotionSpring.gentle);
      setTimeout(() => {
        pulse.value = withSpring(1, MotionSpring.gentle);
      }, 900);
    };
    loop();
    const id = setInterval(loop, 2200);
    return () => clearInterval(id);
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
