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

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { getProductById, productImage } from '@/data/catalog';
import { useCart } from '@/contexts/cart-context';

export default function ProductDetailScreen() {
  const raw = useLocalSearchParams<{ id: string | string[] }>();
  const idStr = Array.isArray(raw.id) ? raw.id[0] : raw.id;
  const product = useMemo(() => getProductById(Number(idStr)), [idStr]);
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={FinesseColors.secondary} />
          <Text style={styles.backTxt}>Back</Text>
        </Pressable>
        <View style={styles.miss}>
          <Text style={styles.missTxt}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(product);
      Alert.alert('Added to cart', `${product.name} was added to your bag.`, [
        { text: 'Keep shopping', style: 'cancel' },
        { text: 'View cart', onPress: () => router.push('/cart') },
      ]);
    } finally {
      setAdding(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Pressable style={styles.backRow} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={FinesseColors.secondary} />
        <Text style={styles.backTxt}>Back</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={productImage(product)} style={styles.heroImg} contentFit="cover" />
        <View style={styles.body}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.meta}>Category · {product.category}</Text>
          <Text style={styles.desc}>
            Handcrafted with care. Materials and sizing can be confirmed at checkout — same quality
            promise as our full Finesse collection.
          </Text>
          <Pressable
            style={[styles.cta, adding && { opacity: 0.7 }]}
            onPress={handleAdd}
            disabled={adding}>
            <Text style={styles.ctaTxt}>{adding ? 'ADDING…' : 'ADD TO CART'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.background },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  backTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 16,
    color: FinesseColors.secondary,
  },
  scroll: { paddingBottom: 40 },
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
  ctaTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: FinesseColors.secondary,
  },
  miss: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  missTxt: { fontFamily: FinesseFonts.sans, color: FinesseColors.textLight, fontSize: 16 },
});
