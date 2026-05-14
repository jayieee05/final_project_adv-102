import { Image } from 'expo-image';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/finesse/app-header';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import type { CatalogProduct, ProductCategory } from '@/data/catalog';
import { getAllProducts } from '@/data/catalog';
import { useMobileContentWidth, useTabScrollPadding } from '@/hooks/use-tab-scroll-padding';

const CATS: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Rings', value: 'rings' },
  { label: 'Necklaces', value: 'necklaces' },
  { label: 'Earrings', value: 'earrings' },
  { label: 'Bracelets', value: 'bracelets' },
];

export default function ShopScreen() {
  const params = useGlobalSearchParams<{ category?: string | string[] }>();
  const categoryParam = params.category;
  const categoryStr = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const initialCategory =
    categoryStr && ['rings', 'necklaces', 'earrings', 'bracelets'].includes(categoryStr)
      ? (categoryStr as ProductCategory)
      : undefined;
  const [selected, setSelected] = useState<ProductCategory | 'all'>(initialCategory ?? 'all');
  const [query, setQuery] = useState('');
  const { width, horizontalPad, isNarrow } = useMobileContentWidth();
  const scrollBottom = useTabScrollPadding(12);
  const gap = 12;
  const numCols = isNarrow ? 1 : width >= 600 ? 3 : 2;
  const listPad = horizontalPad * 2;
  const tile = (width - listPad - gap * Math.max(0, numCols - 1)) / numCols;

  React.useEffect(() => {
    if (categoryStr && ['rings', 'necklaces', 'earrings', 'bracelets'].includes(categoryStr)) {
      setSelected(categoryStr as ProductCategory);
    }
  }, [categoryStr]);

  const filtered = useMemo(() => {
    const all = getAllProducts();
    return all.filter((p) => {
      const catOk = selected === 'all' || p.category === selected;
      const q = query.trim().toLowerCase();
      const searchOk = !q || p.name.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [selected, query]);

  const renderItem = ({ item }: { item: CatalogProduct }) => (
    <Pressable
      style={[styles.tile, { width: tile, marginBottom: gap }]}
      onPress={() => router.push(`/product/${item.id}`)}>
      <Image source={{ uri: item.image }} style={[styles.img, { height: tile }]} contentFit="cover" />
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.price}>{item.price}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <View style={[styles.hero, { paddingHorizontal: horizontalPad }]}>
        <Text style={[styles.heroBadge, isNarrow && styles.heroBadgeSmall]}>Our Collection</Text>
        <Text style={[styles.heroTitle, isNarrow && styles.heroTitleSmall]}>
          Discover Timeless Elegance
        </Text>
        <Text style={[styles.heroSub, isNarrow && styles.heroSubSmall]}>
          Handcrafted jewelry pieces designed to last a lifetime
        </Text>
      </View>
      <View style={[styles.toolbar, { paddingHorizontal: horizontalPad }]}>
        <TextInput
          style={styles.search}
          placeholder="Search products..."
          placeholderTextColor={FinesseColors.textLight}
          value={query}
          onChangeText={setQuery}
        />
        <FlatList
          horizontal
          data={CATS}
          keyExtractor={(c) => c.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item: c }) => (
            <Pressable
              onPress={() => setSelected(c.value)}
              style={[styles.chip, selected === c.value && styles.chipOn]}>
              <Text style={[styles.chipTxt, selected === c.value && styles.chipTxtOn]}>{c.label}</Text>
            </Pressable>
          )}
        />
      </View>
      <FlatList
        data={filtered}
        key={numCols}
        numColumns={numCols}
        keyExtractor={(p) => String(p.id)}
        columnWrapperStyle={numCols > 1 ? { gap } : undefined}
        contentContainerStyle={[styles.list, { paddingBottom: scrollBottom, paddingHorizontal: horizontalPad }]}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No products match your filters.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.backgroundAlt },
  hero: {
    paddingVertical: 24,
    backgroundColor: FinesseColors.secondary,
  },
  heroBadge: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    color: FinesseColors.primaryLight,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroBadgeSmall: { fontSize: 10, letterSpacing: 2 },
  heroTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 28,
    color: FinesseColors.white,
    marginBottom: 8,
  },
  heroTitleSmall: { fontSize: 24, lineHeight: 30 },
  heroSub: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 22,
  },
  heroSubSmall: { fontSize: 14, lineHeight: 20 },
  toolbar: {
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: FinesseColors.background,
    borderBottomWidth: 1,
    borderBottomColor: FinesseColors.border,
    gap: 12,
  },
  search: {
    borderWidth: 1,
    borderColor: FinesseColors.border,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FinesseFonts.sans,
    fontSize: 15,
    color: FinesseColors.text,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  chipsRow: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: FinesseColors.border,
    backgroundColor: FinesseColors.background,
  },
  chipOn: {
    backgroundColor: FinesseColors.secondary,
    borderColor: FinesseColors.secondary,
  },
  chipTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    color: FinesseColors.text,
  },
  chipTxtOn: { color: FinesseColors.white },
  list: { paddingTop: 12 },
  tile: {
    backgroundColor: FinesseColors.background,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: FinesseColors.border,
    overflow: 'hidden',
  },
  img: { width: '100%', backgroundColor: FinesseColors.backgroundAlt },
  name: {
    fontFamily: FinesseFonts.serif,
    fontSize: 16,
    color: FinesseColors.secondary,
    paddingHorizontal: 10,
    paddingTop: 10,
    minHeight: 44,
  },
  price: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: FinesseColors.primaryDark,
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: FinesseFonts.sans,
    color: FinesseColors.textLight,
  },
});
