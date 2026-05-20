import React, { useEffect } from 'react';
import { Animated, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { FinesseColors } from '@/constants/finesse-theme';

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style }: SkeletonProps) {
  const pulse = React.useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.85,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View
      style={[
        styles.base,
        { width, height, borderRadius, overflow: 'hidden' },
        style,
      ]}>
      <Animated.View style={[styles.shimmer, { opacity: pulse }]} />
    </View>
  );
}

type SkeletonGroupProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonGroup({ children, style }: SkeletonGroupProps) {
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: FinesseColors.border,
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: FinesseColors.backgroundAlt,
  },
});
