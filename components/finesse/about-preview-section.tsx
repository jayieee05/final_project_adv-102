import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { CRAFT_JEWELRY_IMAGE } from '@/data/product-images';

import { useMobileContentWidth } from '@/hooks/use-tab-scroll-padding';

export function AboutPreviewSection() {
  const { horizontalPad, isCompact } = useMobileContentWidth();
  const titleSize = isCompact ? 28 : 34;

  return (
    <View style={[styles.section, { paddingHorizontal: horizontalPad, paddingVertical: isCompact ? 32 : 40 }]}>
      <Image source={CRAFT_JEWELRY_IMAGE} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <Text style={styles.kicker}>Discover Our</Text>
        <Text style={[styles.title, { fontSize: titleSize }]}>Our Craftsmanship</Text>
        <Text style={[styles.body, { fontSize: isCompact ? 15 : 16 }]}>
          Each piece is meticulously handcrafted by our skilled artisans using only the finest
          materials. We believe in creating timeless accessories that can be cherished for
          generations.
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/about')}
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}>
          <Text style={styles.btnText}>Learn More</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: FinesseColors.background,
    gap: 20,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  content: { paddingHorizontal: 2 },
  kicker: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    color: FinesseColors.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: FinesseFonts.serif,
    color: FinesseColors.secondary,
    marginBottom: 14,
  },
  body: {
    fontFamily: FinesseFonts.sans,
    lineHeight: 26,
    color: FinesseColors.text,
    marginBottom: 22,
  },
  btn: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: FinesseColors.secondary,
    minHeight: 48,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.5,
    color: FinesseColors.secondary,
  },
});
