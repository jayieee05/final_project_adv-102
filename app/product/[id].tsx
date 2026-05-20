import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductRelatedCarousel } from '@/components/finesse/product-related-carousel';
import { ProductReviewsSection } from '@/components/finesse/product-reviews-section';
import { FadeInView, ScalePressable } from '@/components/ui/motion';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { getProductById, productImage } from '@/data/catalog';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { promptSignInForCart } from '@/lib/cart-auth';

export default function ProductDetailScreen() {
  const raw = useLocalSearchParams<{ id: string | string[] }>();
  const idStr = Array.isArray(raw.id) ? raw.id[0] : raw.id;
  const product = useMemo(() => getProductById(Number(idStr)), [idStr]);
  const { isAuthenticated } = useAuth();
  const { addToCart, getTotalItems } = useCart();
  const [adding, setAdding] = useState(false);
  const cartCount = getTotalItems();

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={FinesseColors.secondary} />
            <Text style={styles.backTxt}>Back</Text>
          </Pressable>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.miss}>
          <Text style={styles.missTxt}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAdd = async () => {
    if (!isAuthenticated()) {
      promptSignInForCart();
      return;
    }
    setAdding(true);
    try {
      const added = await addToCart(product);
      if (!added) return;
      const buttons: { text: string; style?: 'cancel' | 'default'; onPress?: () => void }[] = [
        { text: 'Keep shopping', style: 'cancel' },
        { text: 'View cart', onPress: () => router.push('/cart') },
      ];
      if (isAuthenticated()) {
        buttons.push({ text: 'Checkout', onPress: () => router.push('/checkout') });
      }
      Alert.alert('Added to cart', `${product.name} was added to your bag.`, buttons);
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={FinesseColors.secondary} />
          <Text style={styles.backTxt}>Back</Text>
        </Pressable>
        <Pressable
          style={styles.cartBtn}
          onPress={() => router.push('/cart')}
          hitSlop={8}
          accessibilityLabel="Open shopping cart">
          <Ionicons name="bag-outline" size={24} color={FinesseColors.secondary} />
          {cartCount > 0 ? (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeTxt}>{cartCount > 99 ? '99+' : cartCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <FadeInView from="fade" index={0}>
          <Image source={productImage(product)} style={styles.heroImg} contentFit="cover" />
        </FadeInView>

        <FadeInView index={1} style={styles.body}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.meta}>Category · {product.category}</Text>
          <Text style={styles.desc}>
            Handcrafted with care. Materials and sizing can be confirmed at checkout — same quality
            promise as our full Finesse collection.
          </Text>
          <ScalePressable
            style={[
              styles.cta,
              adding && { opacity: 0.7 },
              !isAuthenticated() && styles.ctaDisabled,
            ]}
            onPress={handleAdd}
            disabled={adding}
            haptic={!adding && isAuthenticated()}>
            <Text style={styles.ctaTxt}>
              {adding ? 'ADDING…' : isAuthenticated() ? 'ADD TO CART' : 'SIGN IN TO ADD'}
            </Text>
          </ScalePressable>
        </FadeInView>

        <View style={styles.divider} />

        <View style={styles.sectionPad}>
          <ProductReviewsSection productId={product.id} />
        </View>

        <View style={styles.divider} />

        <View style={styles.sectionPad}>
          <ProductRelatedCarousel productId={product.id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: FinesseColors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  headerSpacer: { width: 44 },
  backTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 16,
    color: FinesseColors.secondary,
  },
  cartBtn: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: FinesseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 10,
    color: FinesseColors.secondary,
  },
  scroll: { paddingBottom: 48 },
  heroImg: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  body: { padding: 20 },
  name: {
    fontFamily: FinesseFonts.serif,
    fontSize: 32,
    color: FinesseColors.secondary,
    marginBottom: 8,
  },
  price: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 22,
    color: FinesseColors.primaryDark,
    marginBottom: 8,
  },
  meta: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: FinesseColors.textLight,
    textTransform: 'capitalize',
    marginBottom: 16,
  },
  desc: {
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    lineHeight: 26,
    color: FinesseColors.text,
    marginBottom: 28,
  },
  cta: {
    backgroundColor: FinesseColors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 2,
  },
  ctaDisabled: {
    backgroundColor: FinesseColors.border,
    opacity: 0.85,
  },
  ctaTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: FinesseColors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: FinesseColors.border,
    marginHorizontal: 20,
  },
  sectionPad: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  miss: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  missTxt: { fontFamily: FinesseFonts.sans, color: FinesseColors.textLight, fontSize: 16 },
});
