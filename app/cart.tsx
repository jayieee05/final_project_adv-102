import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
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
import { useAuth } from '@/contexts/auth-context';
import { cartLineImage, useCart } from '@/contexts/cart-context';
import { formatPeso } from '@/lib/format-currency';
import { calculateOrderTotals } from '@/lib/transactions';

export default function CartScreen() {
  const { isAuthenticated } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const subtotal = getTotalPrice();
  const { shipping, total } = calculateOrderTotals(cartItems.length, subtotal);

  const goCheckout = () => {
    if (!isAuthenticated()) {
      Alert.alert('Sign in required', 'Please log in to complete your purchase.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log in', onPress: () => router.push('/login') },
      ]);
      return;
    }
    router.push('/checkout');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your bag</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={FinesseColors.secondary} />
        </Pressable>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>Your cart is empty.</Text>
          <Pressable style={styles.shopBtn} onPress={() => router.replace('/(tabs)/shop')}>
            <Text style={styles.shopBtnTxt}>Browse shop</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list}>
            {cartItems.map((item) => (
              <View key={`${item.id}-${item.size}-${item.material}`} style={styles.row}>
                <Image source={cartLineImage(item)} style={styles.thumb} contentFit="cover" />
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.price}>{item.price}</Text>
                  <View style={styles.qtyRow}>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() =>
                        updateQuantity(item.id, item.quantity - 1, item.size, item.material)
                      }>
                      <Text style={styles.qtyTxt}>−</Text>
                    </Pressable>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <Pressable
                      style={styles.qtyBtn}
                      onPress={() =>
                        updateQuantity(item.id, item.quantity + 1, item.size, item.material)
                      }>
                      <Text style={styles.qtyTxt}>+</Text>
                    </Pressable>
                    <Pressable
                      style={styles.remove}
                      onPress={() => removeFromCart(item.id, item.size, item.material)}>
                      <Text style={styles.removeTxt}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalVal}>{formatPeso(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalVal}>{formatPeso(shipping)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>{formatPeso(total)}</Text>
            </View>
            <Pressable style={styles.checkout} onPress={goCheckout}>
              <Text style={styles.checkoutTxt}>PROCEED TO PAYMENT</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                Alert.alert('Clear cart?', 'This removes all items.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', style: 'destructive', onPress: () => void clearCart() },
                ])
              }>
              <Text style={styles.clear}>Clear cart</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: FinesseColors.border,
  },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 26,
    color: FinesseColors.secondary,
  },
  list: { padding: 16, paddingBottom: 24 },
  row: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: FinesseColors.border,
    paddingBottom: 16,
  },
  thumb: { width: 88, height: 88, borderRadius: 4, backgroundColor: FinesseColors.backgroundAlt },
  info: { flex: 1 },
  name: {
    fontFamily: FinesseFonts.serif,
    fontSize: 18,
    color: FinesseColors.secondary,
    marginBottom: 4,
  },
  price: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 15,
    color: FinesseColors.primaryDark,
    marginBottom: 10,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: FinesseColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FinesseColors.backgroundAlt,
  },
  qtyTxt: { fontSize: 18, color: FinesseColors.secondary, fontFamily: FinesseFonts.sansMedium },
  qty: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 16,
    minWidth: 24,
    textAlign: 'center',
    color: FinesseColors.text,
  },
  remove: { marginLeft: 'auto' },
  removeTxt: {
    fontFamily: FinesseFonts.sans,
    color: FinesseColors.textLight,
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: FinesseColors.border,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grandTotal: {
    marginBottom: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: FinesseColors.border,
  },
  totalLabel: { fontFamily: FinesseFonts.sans, fontSize: 16, color: FinesseColors.text },
  totalVal: {
    fontFamily: FinesseFonts.serif,
    fontSize: 22,
    color: FinesseColors.secondary,
  },
  checkout: {
    backgroundColor: FinesseColors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 12,
  },
  checkoutTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: FinesseColors.secondary,
  },
  clear: {
    textAlign: 'center',
    fontFamily: FinesseFonts.sans,
    color: FinesseColors.textLight,
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTxt: {
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    color: FinesseColors.textLight,
    marginBottom: 20,
  },
  shopBtn: {
    borderWidth: 2,
    borderColor: FinesseColors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  shopBtnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    color: FinesseColors.secondary,
    letterSpacing: 1,
  },
});
