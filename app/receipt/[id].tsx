import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OrderReceipt } from '@/components/finesse/order-receipt';
import { FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { formatPeso } from '@/lib/format-currency';
import { peekPendingReceipt, takePendingReceipt } from '@/lib/pending-receipt';
import { receiptNumberFromId } from '@/lib/receipt-format';
import { fetchTransactionById } from '@/lib/transactions';
import type { Transaction } from '@/types/transaction';

export default function ReceiptScreen() {
  const { id: rawId, new: rawNew } = useLocalSearchParams<{ id: string | string[]; new?: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const isNewPurchase = (Array.isArray(rawNew) ? rawNew[0] : rawNew) === '1';

  const { user, isAuthenticated, isLoading: authLoading, isOwner } = useAuth();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id || !user?.id) return;

    const cached = takePendingReceipt(id) ?? peekPendingReceipt(id);
    if (cached) {
      setTransaction(cached);
      setError('');
      return;
    }

    const customerId = isOwner() ? undefined : String(user.id);

    try {
      const tx = await fetchTransactionById(id, customerId);
      if (!tx) {
        setError('Receipt not found.');
        setTransaction(null);
        return;
      }
      if (!isOwner() && String(user.id) !== tx.userId) {
        setError('You do not have access to this receipt.');
        setTransaction(null);
        return;
      }
      setTransaction(tx);
      setError('');
    } catch {
      setError('Could not load receipt.');
    }
  }, [id, user?.id, isOwner]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    if (!id) {
      setError('Invalid receipt link.');
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [authLoading, isAuthenticated, id, load]);

  const shareReceipt = async () => {
    if (!transaction) return;
    const no = receiptNumberFromId(transaction.id);
    try {
      await Share.share({
        message: `Finesse Jewelry — Receipt ${no}\nTotal: ${formatPeso(transaction.total)}\nThank you for your order!`,
      });
    } catch {
      /* cancelled */
    }
  };

  const goBack = () => {
    if (isNewPurchase) {
      router.replace('/(tabs)/shop');
    } else if (isOwner()) {
      router.replace('/dashboard');
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#2a2118', '#4a3c2d', '#3d3228']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={goBack} hitSlop={12}>
            <Ionicons
              name={isNewPurchase ? 'home-outline' : 'chevron-back'}
              size={26}
              color="#f9f6f2"
            />
          </Pressable>
          <Text style={styles.headerTitle}>{isOwner() ? 'Order receipt' : 'Your receipt'}</Text>
          {transaction ? (
            <Pressable onPress={() => void shareReceipt()} hitSlop={12}>
              <Ionicons name="share-outline" size={24} color="#f9f6f2" />
            </Pressable>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        {loading || authLoading ? (
          <ActivityIndicator color="#d4b86a" style={{ marginTop: 48 }} />
        ) : error ? (
          <View style={styles.errWrap}>
            <Text style={styles.err}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={() => void load()}>
              <Text style={styles.retryTxt}>Try again</Text>
            </Pressable>
          </View>
        ) : transaction ? (
          <>
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}>
              <OrderReceipt transaction={transaction} showCelebration={isNewPurchase} />
            </ScrollView>
            <View style={styles.actions}>
              {isOwner() ? (
                <Pressable style={styles.primaryBtn} onPress={() => router.replace('/dashboard')}>
                  <Text style={styles.primaryBtnTxt}>BACK TO DASHBOARD</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.primaryBtn} onPress={() => router.replace('/orders')}>
                  <Text style={styles.primaryBtnTxt}>ALL ORDERS</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.secondaryBtn}
                onPress={() => router.replace('/(tabs)/shop')}>
                <Text style={styles.secondaryBtnTxt}>Continue shopping</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 22,
    color: '#f9f6f2',
    letterSpacing: 1,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  errWrap: { paddingHorizontal: 24, marginTop: 48, alignItems: 'center' },
  err: {
    fontFamily: FinesseFonts.sans,
    color: '#f9f6f2',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: '#d4b86a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2,
  },
  retryTxt: {
    fontFamily: FinesseFonts.sansMedium,
    color: '#d4b86a',
    letterSpacing: 1,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: '#c8a97e',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 2,
  },
  primaryBtnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: '#2c241c',
  },
  secondaryBtn: { paddingVertical: 10, alignItems: 'center' },
  secondaryBtnTxt: {
    fontFamily: FinesseFonts.sans,
    color: '#d4b86a',
    textDecorationLine: 'underline',
  },
});
