import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { FadeInView, ScalePressable } from '@/components/ui/motion';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { getRelatedProducts, productImage, type CatalogProduct } from '@/data/catalog';

const CARD_GAP = 12;

type ProductRelatedCarouselProps = {
  productId: number;
};

export function ProductRelatedCarousel({ productId }: ProductRelatedCarouselProps) {
  const items = useMemo(() => getRelatedProducts(productId, 6), [productId]);
  const cardWidth = 148;

  if (items.length === 0) return null;

  return (
    <FadeInView index={0} style={styles.section}>
      <Text style={styles.sectionTitle}>You may also like</Text>
      <FlatList
        horizontal
        nestedScrollEnabled
        data={items}
        keyExtractor={(p) => String(p.id)}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + CARD_GAP}
        snapToAlignment="start"
        disableIntervalMomentum
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        renderItem={({ item, index }) => (
          <RelatedCard product={item} index={index} width={cardWidth} />
        )}
      />
    </FadeInView>
  );
}

function RelatedCard({
  product,
  index,
  width,
}: {
  product: CatalogProduct;
  index: number;
  width: number;
}) {
  return (
    <FadeInView index={index} delay={60}>
      <ScalePressable
        style={[styles.card, { width }]}
        onPress={() => router.push(`/product/${product.id}`)}>
        <Image source={productImage(product)} style={styles.img} contentFit="cover" />
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{product.price}</Text>
      </ScalePressable>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 26,
    color: FinesseColors.secondary,
    marginBottom: 16,
  },
  listContent: {
    paddingRight: 20,
  },
  card: {
    backgroundColor: FinesseColors.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  img: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  name: {
    fontFamily: FinesseFonts.serif,
    fontSize: 16,
    color: FinesseColors.secondary,
    marginBottom: 4,
    minHeight: 40,
  },
  price: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: FinesseColors.primaryDark,
  },
});
