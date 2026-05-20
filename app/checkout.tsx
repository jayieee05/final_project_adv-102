import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckoutSkeleton } from '@/components/finesse/skeleton-screens';
import { FadeInView, ScalePressable } from '@/components/ui/motion';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { cartLineImage, useCart } from '@/contexts/cart-context';
import { formatPeso } from '@/lib/format-currency';
import { digitsOnly, validatePaymentMethod } from '@/lib/payment-validation';
import { setPendingReceipt } from '@/lib/pending-receipt';
import { calculateOrderTotals, createTransaction } from '@/lib/transactions';
import type { PaymentMethod } from '@/types/transaction';

const METHODS: { id: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'card', label: 'Card', icon: 'card-outline' },
  { id: 'gcash', label: 'GCash', icon: 'phone-portrait-outline' },
  { id: 'cod', label: 'Cash on delivery', icon: 'cash-outline' },
];

export default function CheckoutScreen() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const completingPayment = useRef(false);

  const subtotal = getTotalPrice();
  const { shipping, total } = useMemo(
    () => calculateOrderTotals(cartItems.length, subtotal),
    [cartItems.length, subtotal],
  );

  React.useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    if (cartItems.length === 0 && !completingPayment.current && !loading) {
      router.replace('/cart');
    }
  }, [isAuthenticated, cartItems.length, loading]);

  const formatExpiry = (text: string) => {
    const d = digitsOnly(text).slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const formatCardDisplay = (text: string) => {
    const d = digitsOnly(text).slice(0, 16);
    return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const pay = async () => {
    if (!user) return;
    setError('');

    const cardInput = { cardholderName, cardNumber, expiry, cvv };
    const gcashInput = { gcashNumber };
    const validationError = validatePaymentMethod(
      method,
      method === 'card' ? cardInput : undefined,
      method === 'gcash' ? gcashInput : undefined,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const result = await createTransaction({
        user,
        items: cartItems,
        paymentMethod: method,
        ...(method === 'card' ? { card: cardInput } : {}),
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      completingPayment.current = true;
      setPendingReceipt(result.transaction);
      router.replace({
        pathname: '/receipt/[id]',
        params: { id: result.transaction.id, new: '1' },
      });
      await clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <CheckoutSkeleton />
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={28} color={FinesseColors.secondary} />
          </Pressable>
          <Text style={styles.title}>Checkout</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <FadeInView index={0}>
          <Text style={styles.sectionLabel}>Order summary</Text>
          <View style={styles.card}>
            {cartItems.map((item) => (
              <View key={`${item.id}-${item.size}-${item.material}`} style={styles.itemRow}>
                <Image source={cartLineImage(item)} style={styles.thumb} contentFit="cover" />
                <View style={styles.itemMeta}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQty}>
                    Qty {item.quantity} · {formatPeso(item.priceValue * item.quantity)}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.summaryLine}>
              <Text style={styles.summaryTxt}>Subtotal</Text>
              <Text style={styles.summaryVal}>{formatPeso(subtotal)}</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryTxt}>Shipping</Text>
              <Text style={styles.summaryVal}>{formatPeso(shipping)}</Text>
            </View>
            <View style={[styles.summaryLine, styles.summaryTotal]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>{formatPeso(total)}</Text>
            </View>
          </View>
          </FadeInView>

          <FadeInView index={1}>
          <Text style={styles.sectionLabel}>Deliver to</Text>
          <View style={styles.card}>
            <Text style={styles.shipName}>{user.name}</Text>
            <Text style={styles.shipDetail}>{user.email}</Text>
            {user.phone ? <Text style={styles.shipDetail}>{user.phone}</Text> : null}
            {user.city || user.address ? (
              <Text style={styles.shipDetail}>
                {[user.address, user.city, user.country].filter(Boolean).join(', ') || '—'}
              </Text>
            ) : (
              <Text style={styles.shipHint}>Add address in your profile for faster delivery.</Text>
            )}
          </View>
          </FadeInView>

          <FadeInView index={2}>
          <Text style={styles.sectionLabel}>Payment method</Text>
          <View style={styles.methodRow}>
            {METHODS.map((m) => (
              <Pressable
                key={m.id}
                style={[styles.methodChip, method === m.id && styles.methodChipActive]}
                onPress={() => setMethod(m.id)}>
                <Ionicons
                  name={m.icon}
                  size={18}
                  color={method === m.id ? FinesseColors.background : FinesseColors.secondary}
                />
                <Text style={[styles.methodTxt, method === m.id && styles.methodTxtActive]}>
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {method === 'card' ? (
            <View style={styles.card}>
              <Text style={styles.label}>Name on card</Text>
              <TextInput
                style={styles.input}
                value={cardholderName}
                onChangeText={setCardholderName}
                placeholder="Full name"
                placeholderTextColor={FinesseColors.textLight}
                autoComplete="name"
              />
              <Text style={styles.label}>Card number</Text>
              <TextInput
                style={styles.input}
                value={formatCardDisplay(cardNumber)}
                onChangeText={(t) => setCardNumber(digitsOnly(t).slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={FinesseColors.textLight}
                keyboardType="number-pad"
              />
              <View style={styles.row2}>
                <View style={styles.half}>
                  <Text style={styles.label}>Expiry</Text>
                  <TextInput
                    style={styles.input}
                    value={expiry}
                    onChangeText={(t) => setExpiry(formatExpiry(t))}
                    placeholder="MM/YY"
                    placeholderTextColor={FinesseColors.textLight}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                <View style={styles.half}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={(t) => setCvv(digitsOnly(t).slice(0, 4))}
                    placeholder="123"
                    placeholderTextColor={FinesseColors.textLight}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
                  />
                </View>
              </View>
              <Text style={styles.secureNote}>
                Card details are validated securely. Only the last 4 digits are stored.
              </Text>
            </View>
          ) : null}

          {method === 'gcash' ? (
            <View style={styles.card}>
              <Text style={styles.label}>GCash mobile number</Text>
              <TextInput
                style={styles.input}
                value={gcashNumber}
                onChangeText={setGcashNumber}
                placeholder="09XX XXX XXXX"
                placeholderTextColor={FinesseColors.textLight}
                keyboardType="phone-pad"
              />
              <Text style={styles.secureNote}>
                You will receive a payment request on GCash after confirming.
              </Text>
            </View>
          ) : null}

          {method === 'cod' ? (
            <View style={styles.card}>
              <Text style={styles.codNote}>
                Pay when your order arrives. Your transaction will be marked as pending until
                payment is collected.
              </Text>
            </View>
          ) : null}

          {error ? <Text style={styles.err}>{error}</Text> : null}
          </FadeInView>
        </ScrollView>

        <FadeInView delay={60} style={styles.footer}>
          <ScalePressable
            style={[styles.payBtn, loading && { opacity: 0.75 }]}
            onPress={() => void pay()}
            disabled={loading}
            haptic={!loading}>
            {loading ? (
              <ActivityIndicator color={FinesseColors.secondary} />
            ) : (
              <Text style={styles.payBtnTxt}>PAY {formatPeso(total)}</Text>
            )}
          </ScalePressable>
        </FadeInView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.background },
  flex: { flex: 1 },
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
    fontSize: 24,
    color: FinesseColors.secondary,
  },
  scroll: { padding: 16, paddingBottom: 24 },
  sectionLabel: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1,
    color: FinesseColors.textLight,
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: FinesseColors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: FinesseColors.border,
    marginBottom: 12,
  },
  itemRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  thumb: { width: 56, height: 56, borderRadius: 4 },
  itemMeta: { flex: 1, justifyContent: 'center' },
  itemName: {
    fontFamily: FinesseFonts.serif,
    fontSize: 16,
    color: FinesseColors.secondary,
    marginBottom: 2,
  },
  itemQty: { fontFamily: FinesseFonts.sans, fontSize: 13, color: FinesseColors.textLight },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryTxt: { fontFamily: FinesseFonts.sans, color: FinesseColors.text },
  summaryVal: { fontFamily: FinesseFonts.sansMedium, color: FinesseColors.text },
  summaryTotal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: FinesseColors.border,
  },
  totalLabel: { fontFamily: FinesseFonts.sansMedium, fontSize: 16, color: FinesseColors.secondary },
  totalVal: { fontFamily: FinesseFonts.serif, fontSize: 22, color: FinesseColors.secondary },
  shipName: {
    fontFamily: FinesseFonts.serif,
    fontSize: 18,
    color: FinesseColors.secondary,
    marginBottom: 4,
  },
  shipDetail: { fontFamily: FinesseFonts.sans, fontSize: 14, color: FinesseColors.text, marginBottom: 2 },
  shipHint: { fontFamily: FinesseFonts.sans, fontSize: 13, color: FinesseColors.textLight, fontStyle: 'italic' },
  methodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  methodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: FinesseColors.border,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  methodChipActive: {
    backgroundColor: FinesseColors.secondary,
    borderColor: FinesseColors.secondary,
  },
  methodTxt: { fontFamily: FinesseFonts.sans, fontSize: 12, color: FinesseColors.secondary },
  methodTxtActive: { color: FinesseColors.background },
  label: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    color: FinesseColors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: FinesseColors.border,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    marginBottom: 14,
    color: FinesseColors.text,
    backgroundColor: FinesseColors.background,
  },
  row2: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  secureNote: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    color: FinesseColors.textLight,
    lineHeight: 16,
  },
  codNote: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: FinesseColors.text,
    lineHeight: 20,
  },
  err: {
    fontFamily: FinesseFonts.sans,
    color: '#b00020',
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: FinesseColors.border,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  payBtn: {
    backgroundColor: FinesseColors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 2,
  },
  payBtnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: FinesseColors.secondary,
  },
});
