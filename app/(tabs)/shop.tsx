import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useGlobalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import type { CatalogProduct, ProductCategory } from '@/data/catalog';
import { getAllProducts } from '@/data/catalog';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useMobileContentWidth } from '@/hooks/use-tab-scroll-padding';

const TAB_BAR_RESTORE = {
  backgroundColor: FinesseColors.background,
  borderTopColor: FinesseColors.border,
  paddingTop: 4,
  minHeight: 52,
} as const;

/** Balanced warm neutrals: light base, chocolate type, gold highlights */
const T = {
  ink: '#2c241c',
  inkSoft: '#5c5046',
  inkMuted: 'rgba(44, 36, 28, 0.45)',
  surface: '#ffffff',
  canvasTop: '#fffdfb',
  canvasBot: '#f6f0e8',
  sand: '#ebe3d7',
  sandDeep: '#dfd4c4',
  line: 'rgba(44, 36, 28, 0.08)',
  gold: '#b8942f',
  goldSoft: 'rgba(184, 148, 47, 0.18)',
  chipBg: '#f3efe8',
  badge: '#c45a5a',
};

const CATS: {
  label: string;
  value: ProductCategory | 'all';
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: 'All', value: 'all', icon: 'sparkles-outline' },
  { label: 'Rings', value: 'rings', icon: 'diamond-outline' },
  { label: 'Necklaces', value: 'necklaces', icon: 'link-outline' },
  { label: 'Earrings', value: 'earrings', icon: 'ellipse-outline' },
  { label: 'Bracelets', value: 'bracelets', icon: 'infinite-outline' },
];

function greetingLine(name?: string | null) {
  const h = new Date().getHours();
  const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const first = name?.trim()?.split(/\s+/)[0];
  return first ? `${part}, ${first}` : `${part}`;
}

function productRating(p: CatalogProduct) {
  const base = 4.2 + (p.id % 8) * 0.1;
  return Math.min(5, Math.round(base * 10) / 10);
}

function categoryLabel(c: ProductCategory) {
  return c.charAt(0).toUpperCase() + c.slice(1);
}

const softShadow = Platform.select({
  ios: {
    shadowColor: '#1a1410',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
  },
  android: { elevation: 4 },
  default: {},
});

const cardLift = Platform.select({
  ios: {
    shadowColor: '#1a1410',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
  default: {},
});

const floatShadow = Platform.select({
  ios: {
    shadowColor: '#1a1410',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  android: { elevation: 10 },
  default: {},
});

export default function ShopScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
export default function ShopScreen() {
  const { user } = useAuth();
  const { addToCart, getTotalItems } = useCart();
  const params = useGlobalSearchParams<{ category?: string | string[] }>();
  const categoryParam = params.category;
  const categoryStr = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const initialCategory =
    categoryStr && ['rings', 'necklaces', 'earrings', 'bracelets'].includes(categoryStr)
      ? (categoryStr as ProductCategory)
      : undefined;
  const [selected, setSelected] = useState<ProductCategory | 'all'>(initialCategory ?? 'all');
  const [query, setQuery] = useState('');
  const { horizontalPad } = useMobileContentWidth();
  const cartCount = getTotalItems();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        tabBarStyle: { display: 'none', height: 0 },
      });
      return () => {
        navigation.setOptions({
          tabBarStyle: { ...TAB_BAR_RESTORE },
        });
      };
    }, [navigation]),
  );
  const scrollBottom = useTabScrollPadding();

  React.useEffect(() => {
    if (categoryStr && ['rings', 'necklaces', 'earrings', 'bracelets'].includes(categoryStr)) {
      setSelected(categoryStr as ProductCategory);
    }
  }, [categoryStr]);

  const filtered = useMemo(() => {
    const all = getAllProducts();
    const q = query.trim().toLowerCase();
    return all.filter((p) => {
      const catOk = selected === 'all' || p.category === selected;
      const searchOk = !q || p.name.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [selected, query]);

  const floatPad = 88 + insets.bottom;

  const header = (
    <View style={{ paddingHorizontal: horizontalPad }}>
      <View style={[styles.heroCard, softShadow]}>
        <View style={styles.accentRule} />
        <View style={styles.heroTop}>
          <Pressable style={styles.iconSoft} hitSlop={8}>
            <Ionicons name="notifications-outline" size={21} color={T.inkSoft} />
            <View style={styles.notifDot} />
          </Pressable>
          <View style={styles.heroTopRight}>
            <View style={styles.heroDecor}>
              <View style={[styles.dc, styles.dc1]} />
              <View style={[styles.dc, styles.dc2]} />
            </View>
            <Pressable
              style={styles.iconSoft}
              onPress={() => router.push('/cart')}
              hitSlop={8}
              accessibilityLabel="Cart">
              <Ionicons name="bag-outline" size={21} color={T.inkSoft} />
              {cartCount > 0 && (
                <View style={styles.cartDot}>
                  <Text style={styles.cartDotTxt}>{cartCount > 99 ? '99+' : cartCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <Text style={styles.kicker}>Finesse boutique</Text>
        <Text style={styles.greeting}>{greetingLine(user?.name)}</Text>
        <Text style={styles.greetingSub}>
          Warm metals, quiet luxury—browse pieces chosen for everyday shine.
        </Text>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={19} color={T.inkMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or style"
            placeholderTextColor={T.inkMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
        style={styles.chipsWrap}>
        {CATS.map((c) => {
          const on = selected === c.value;
          return (
            <Pressable
              key={c.value}
              onPress={() => setSelected(c.value)}
              style={[styles.chip, on && styles.chipOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}>
              <Ionicons
                name={c.icon}
                size={16}
                color={on ? '#fff' : T.inkSoft}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.chipTxt, on && styles.chipTxtOn]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHead}>
        <View>
          <Text style={styles.sectionEyebrow}>This week</Text>
          <Text style={styles.sectionTitle}>Curated collection</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countPillTxt}>{filtered.length} pieces</Text>
        </View>
      </View>
    </View>
  );

  const renderProduct = ({ item }: { item: CatalogProduct }) => {
    const r = productRating(item);
    return (
      <View style={[styles.card, cardLift, { marginHorizontal: horizontalPad }]}>
        <Pressable onPress={() => router.push(`/product/${item.id}`)} style={styles.cardPress}>
          <View style={styles.imgShell}>
            <Image source={{ uri: item.image }} style={styles.img} contentFit="cover" />
          </View>
          <View style={styles.cardMain}>
            <View style={styles.badgeRow}>
              <Text style={styles.catBadge}>{categoryLabel(item.category)}</Text>
              <View style={styles.rating}>
                <Ionicons name="star" size={13} color={T.gold} />
                <Text style={styles.ratingTxt}>{r.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={styles.pTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.pHint}>Hand-finished · Ready to ship</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.pPrice}>{item.price}</Text>
              <Pressable
                style={styles.addPill}
                onPress={() => void addToCart(item)}
                hitSlop={6}
                accessibilityLabel={`Add ${item.name}`}>
                <Ionicons name="add" size={20} color={T.ink} />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <LinearGradient colors={[T.canvasTop, T.canvasBot]} style={StyleSheet.absoluteFill} />
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={filtered}
          keyExtractor={(p) => String(p.id)}
          ListHeaderComponent={header}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listPad, { paddingBottom: floatPad }]}
          contentContainerStyle={[styles.listPad, { paddingBottom: scrollBottom }]}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          ListEmptyComponent={
            <Text style={[styles.empty, { paddingHorizontal: horizontalPad }]}>
              No matches—try another category or search.
            </Text>
          }
        />

        <View style={[styles.floatBar, { bottom: 14 + insets.bottom }, floatShadow]}>
          <Pressable style={styles.floatHit} onPress={() => router.push('/')} accessibilityLabel="Home">
            <Ionicons name="home-outline" size={24} color={T.inkSoft} />
          </Pressable>
          <View style={styles.floatCenter}>
            <Ionicons name="bag-handle" size={24} color={T.ink} />
            <View style={styles.floatGoldBar} />
          </View>
          <Pressable
            style={styles.floatHit}
            onPress={() =>
              isAuthenticated() ? router.push('/(tabs)/account') : router.push('/login')
            }
            accessibilityLabel="Account">
            <Ionicons name="person-outline" size={24} color={T.inkSoft} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },
  listPad: { paddingTop: 6 },

  heroCard: {
    backgroundColor: T.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: T.line,
    overflow: 'hidden',
  },
  accentRule: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    backgroundColor: T.gold,
    opacity: 0.85,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 8,
  },
  heroTopRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconSoft: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: T.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: T.badge,
    borderWidth: 1.5,
    borderColor: T.surface,
  },
  cartDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: T.surface,
  },
  cartDotTxt: {
    fontSize: 9,
    fontFamily: FinesseFonts.sansMedium,
    color: T.ink,
  },
  heroDecor: { width: 56, height: 36, position: 'relative' },
  dc: { position: 'absolute', borderRadius: 999 },
  dc1: {
    width: 36,
    height: 36,
    backgroundColor: T.goldSoft,
    right: 8,
    top: 0,
  },
  dc2: {
    width: 22,
    height: 22,
    backgroundColor: T.sand,
    right: 0,
    top: 12,
    borderWidth: 1,
    borderColor: T.line,
  },
  kicker: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: T.gold,
    marginBottom: 6,
    paddingLeft: 8,
  },
  greeting: {
    fontFamily: FinesseFonts.serif,
    fontSize: 26,
    color: T.ink,
    letterSpacing: -0.5,
    paddingLeft: 8,
  },
  greetingSub: {
    marginTop: 8,
    fontFamily: FinesseFonts.sansLight,
    fontSize: 15,
    color: T.inkSoft,
    lineHeight: 22,
    maxWidth: 320,
    paddingLeft: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    marginLeft: 8,
    backgroundColor: T.chipBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: T.line,
  },
  searchInput: {
    flex: 1,
    fontFamily: FinesseFonts.sans,
    fontSize: 15,
    color: T.ink,
    paddingVertical: 0,
  },

  chipsWrap: { marginBottom: 6 },
  chipsScroll: { gap: 10, paddingVertical: 4, paddingRight: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.line,
  },
  chipOn: {
    backgroundColor: T.ink,
    borderColor: T.ink,
  },
  chipTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 13,
    color: T.inkSoft,
  },
  chipTxtOn: { color: '#fff' },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionEyebrow: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.5,
    color: T.inkMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 22,
    color: T.ink,
  },
  countPill: {
    backgroundColor: T.chipBg,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: T.line,
  },
  countPillTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    color: T.inkSoft,
  },

  card: {
    backgroundColor: T.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: T.line,
    overflow: 'hidden',
  },
  cardPress: { flexDirection: 'row', padding: 14 },
  imgShell: {
    width: 108,
    height: 108,
    borderRadius: 18,
    backgroundColor: T.sand,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: T.sandDeep,
  },
  img: { width: '100%', height: '100%' },
  cardMain: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    minHeight: 108,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  catBadge: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.inkMuted,
  },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 13,
    color: T.ink,
  },
  pTitle: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 16,
    color: T.ink,
    lineHeight: 22,
    marginTop: 6,
  },
  pHint: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 12,
    color: T.inkMuted,
    marginTop: 4,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  pPrice: {
    fontFamily: FinesseFonts.serif,
    fontSize: 20,
    color: T.ink,
  },
  addPill: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: T.goldSoft,
    borderWidth: 1.5,
    borderColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 28,
    fontFamily: FinesseFonts.sans,
    fontSize: 15,
    color: T.inkMuted,
  },

  floatBar: {
    position: 'absolute',
    alignSelf: 'center',
    left: 40,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: T.line,
  },
  floatHit: {
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  floatCenter: { alignItems: 'center' },
  floatGoldBar: {
    marginTop: 4,
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: T.gold,
  },
});
