import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { FadeInView, ScalePressable } from '@/components/ui/motion';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { CATEGORIES } from '@/data/catalog';
import { productImageSource } from '@/data/product-images';

import { useMobileContentWidth } from '@/hooks/use-tab-scroll-padding';

export function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 380;
  return (
    <FadeInView from="up" index={0} style={[st.titleBlock, { marginBottom: compact ? 20 : 28 }]}>
      <Text style={[st.eyebrow, compact && st.eyebrowCompact]}>{eyebrow}</Text>
      <Text style={[st.title, compact && st.titleCompact]}>{title}</Text>
      <View style={st.underline} />
    </FadeInView>
  );
}

const st = StyleSheet.create({
  titleBlock: { alignItems: 'center' },
  eyebrow: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 4,
    color: FinesseColors.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  eyebrowCompact: { fontSize: 10, letterSpacing: 3, marginBottom: 10 },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 32,
    color: FinesseColors.secondary,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  titleCompact: { fontSize: 26, marginBottom: 12 },
  underline: {
    width: 120,
    height: 3,
    borderRadius: 2,
    backgroundColor: FinesseColors.primary,
    opacity: 0.9,
  },
});

const CARD_GAP = 12;

export function FeaturedCategoriesSection() {
  const { width, horizontalPad, isCompact } = useMobileContentWidth();
  const cardWidth = useMemo(
    () => Math.min(Math.round(width * 0.78), 300),
    [width],
  );
  const snap = cardWidth + CARD_GAP;

  return (
    <View style={[styles.section, { paddingHorizontal: horizontalPad, paddingVertical: isCompact ? 36 : 48 }]}>
      <SectionTitle eyebrow="Explore Our" title="Our Collections" />
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c.slug}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snap}
        snapToAlignment="start"
        disableIntervalMomentum
        contentContainerStyle={{ paddingRight: horizontalPad + 32 }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        renderItem={({ item: c, index }) => (
          <FadeInView index={index} delay={80}>
          <View style={[styles.card, { width: cardWidth }]}>
            <Image source={productImageSource(c.imageKey)} style={styles.cardImg} contentFit="cover" />
            <Text style={[styles.cardName, isCompact && styles.cardNameCompact]}>{c.name}</Text>
            <ScalePressable
              onPress={() => router.push(`/(tabs)/shop?category=${c.slug}` as never)}
              style={styles.btn}>
              <Text style={styles.btnText}>View Collection</Text>
            </ScalePressable>
          </View>
          </FadeInView>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: FinesseColors.background,
  },
  card: {
    backgroundColor: FinesseColors.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: FinesseColors.border,
    paddingBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImg: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 14,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  cardName: {
    fontFamily: FinesseFonts.serif,
    fontSize: 24,
    color: FinesseColors.secondary,
    marginBottom: 12,
  },
  cardNameCompact: { fontSize: 22 },
  btn: {
    borderWidth: 2,
    borderColor: FinesseColors.secondary,
    minHeight: 44,
    paddingVertical: 12,
    paddingHorizontal: 20,
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
