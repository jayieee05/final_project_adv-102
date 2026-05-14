import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1617038260897-41a1f644bcf9?w=900&q=85';

export function HomeHero() {
  const { width, height } = useWindowDimensions();
  const compact = width < 380;

  const layout = useMemo(() => {
    const minH = Math.min(480, Math.max(300, height * 0.4));
    const titleSize = compact ? Math.min(30, width * 0.078) : Math.min(36, width * 0.09);
    const subSize = compact ? 14 : 16;
    const kickerSize = compact ? 10 : 12;
    const kickerLetter = compact ? 2.5 : 4;
    return { minH, titleSize, subSize, kickerSize, kickerLetter };
  }, [width, height, compact]);

  return (
    <View style={[styles.wrap, { minHeight: layout.minH }]}>
      <Image source={{ uri: ABOUT_IMAGE }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.55)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.inner, { paddingHorizontal: compact ? 18 : 24 }]}>
        <Text
          style={[
            styles.kicker,
            { fontSize: layout.kickerSize, letterSpacing: layout.kickerLetter },
          ]}>
          Crafted with Excellence
        </Text>
        <Text style={[styles.title, { fontSize: layout.titleSize, lineHeight: layout.titleSize + 6 }]}>
          High Quality Timeless Accessories
        </Text>
        <Text style={[styles.sub, { fontSize: layout.subSize, paddingHorizontal: compact ? 4 : 0 }]}>
          Discover our collection of handcrafted jewelry pieces designed to last a lifetime
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/shop')}
          style={({ pressed }) => [styles.cta, compact && styles.ctaCompact, pressed && { opacity: 0.9 }]}>
          <Text style={[styles.ctaText, compact && styles.ctaTextCompact]}>SHOP NOW</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: FinesseColors.heroBg,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inner: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  kicker: {
    fontFamily: FinesseFonts.sansMedium,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    fontFamily: FinesseFonts.serif,
    textAlign: 'center',
    color: FinesseColors.white,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    maxWidth: 400,
  },
  sub: {
    fontFamily: FinesseFonts.sansLight,
    lineHeight: 24,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.95)',
    maxWidth: 340,
    marginBottom: 28,
  },
  cta: {
    backgroundColor: FinesseColors.primary,
    minHeight: 48,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: FinesseColors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaCompact: {
    paddingHorizontal: 28,
    minWidth: 0,
    alignSelf: 'stretch',
    maxWidth: 320,
  },
  ctaText: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    letterSpacing: 2,
    color: FinesseColors.secondary,
  },
  ctaTextCompact: { fontSize: 13, letterSpacing: 1.6 },
});
