import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { formatPeso } from '@/lib/format-currency';
import { paymentMethodLabel } from '@/lib/transactions';
import type { PaymentMethod } from '@/types/transaction';

export default function CheckoutSuccessScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    total?: string | string[];
    method?: string | string[];
  }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const total = Number(Array.isArray(params.total) ? params.total[0] : params.total);
  const method = (Array.isArray(params.method) ? params.method[0] : params.method) as
    | PaymentMethod
    | undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={72} color={FinesseColors.primaryDark} />
        </View>
        <Text style={styles.title}>Payment successful</Text>
        <Text style={styles.sub}>
          Thank you for your order. We are preparing your jewelry with care.
        </Text>
        {total > 0 ? (
          <Text style={styles.amount}>{formatPeso(total)}</Text>
        ) : null}
        {method ? (
          <Text style={styles.meta}>{paymentMethodLabel(method)}</Text>
        ) : null}
        {id ? <Text style={styles.orderId}>Order #{id.slice(0, 8).toUpperCase()}</Text> : null}

        {id ? (
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              router.replace({ pathname: '/receipt/[id]', params: { id } })
            }>
            <Text style={styles.primaryBtnTxt}>VIEW RECEIPT</Text>
          </Pressable>
        ) : null}
        <Pressable style={styles.primaryBtn} onPress={() => router.replace('/orders')}>
          <Text style={styles.primaryBtnTxt}>VIEW ORDERS</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.replace('/(tabs)/shop')}>
          <Text style={styles.secondaryBtnTxt}>Continue shopping</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.background },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconWrap: { marginBottom: 20 },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 32,
    color: FinesseColors.secondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  sub: {
    fontFamily: FinesseFonts.sans,
    fontSize: 15,
    color: FinesseColors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  amount: {
    fontFamily: FinesseFonts.serif,
    fontSize: 28,
    color: FinesseColors.primaryDark,
    marginBottom: 8,
  },
  meta: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: FinesseColors.text,
    marginBottom: 4,
  },
  orderId: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1,
    color: FinesseColors.textLight,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: FinesseColors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 2,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: FinesseColors.background,
  },
  secondaryBtn: { paddingVertical: 12 },
  secondaryBtnTxt: {
    fontFamily: FinesseFonts.sans,
    color: FinesseColors.primaryDark,
    textDecorationLine: 'underline',
  },
});
