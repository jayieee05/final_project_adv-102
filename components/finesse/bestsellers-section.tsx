import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FadeInView, ScalePressable } from '@/components/ui/motion';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { getBestsellers, productImage } from '@/data/catalog';

import { useMobileContentWidth } from '@/hooks/use-tab-scroll-padding';

import { SectionTitle } from './featured-categories';

const CARD_GAP = 12;

export function BestsellersSection() {
  const items = getBestsellers();
  const { width, horizontalPad, isCompact } = useMobileContentWidth();
  const cardWidth = useMemo(
    () => Math.min(Math.round(width * 0.72), 260),
    [width],
  );
  const snap = cardWidth + CARD_GAP;

  return (
    <View style={[styles.section, { paddingHorizontal: horizontalPad, paddingVertical: isCompact ? 36 : 48 }]}>
      <SectionTitle eyebrow="Featured Products" title="Bestsellers" />
      <FlatList
        horizontal
        data={items}
        keyExtractor={(p) => String(p.id)}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snap}
        snapToAlignment="start"
        disableIntervalMomentum
        contentContainerStyle={{ paddingRight: horizontalPad + 32 }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        renderItem={({ item: p, index }) => (
          <FadeInView index={index} delay={80}>
          <View style={[styles.card, { width: cardWidth }]}>
            <Image source={productImage(p)} style={styles.img} contentFit="cover" />
            <Text style={[styles.name, isCompact && styles.nameCompact]} numberOfLines={2}>
              {p.name}
            </Text>
            <Text style={styles.price}>{p.price}</Text>
            <ScalePressable
              onPress={() => router.push(`/product/${p.id}`)}
              style={styles.btn}>
              <Text style={styles.btnText}>View Details</Text>
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
    backgroundColor: FinesseColors.backgroundAlt,
  },
  card: {
    backgroundColor: FinesseColors.background,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FinesseColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  img: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  name: {
    fontFamily: FinesseFonts.serif,
    fontSize: 20,
    color: FinesseColors.secondary,
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 52,
  },
  nameCompact: { fontSize: 18, minHeight: 48 },
  price: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 15,
    color: FinesseColors.primaryDark,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: FinesseColors.secondary,
    minHeight: 44,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  btnText: {
    color: FinesseColors.background,
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
  },
});
