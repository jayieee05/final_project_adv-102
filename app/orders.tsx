import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { formatPeso } from '@/lib/format-currency';
import { orderStatusColor, orderStatusLabel } from '@/lib/order-status';
import { fetchUserTransactions, paymentMethodLabel } from '@/lib/transactions';
import type { Transaction } from '@/types/transaction';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function statusLabel(tx: Transaction) {
  if (tx.paymentStatus === 'paid') return 'Paid';
  if (tx.paymentStatus === 'pending') return 'Pending payment';
  return 'Failed';
}

export default function OrdersScreen() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await fetchUserTransactions(String(user.id));
      setOrders(data);
      setError('');
    } catch {
      setError('Could not load orders. Pull to refresh.');
    }
  }, [user?.id]);

  React.useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [isAuthenticated, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={FinesseColors.secondary} />
        </Pressable>
        <Text style={styles.title}>Orders & payments</Text>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={FinesseColors.primaryDark} style={{ marginTop: 48 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}>
          {error ? <Text style={styles.err}>{error}</Text> : null}
          {orders.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={48} color={FinesseColors.textLight} />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySub}>
                Complete a checkout from your cart to see transactions here.
              </Text>
              <Pressable style={styles.shopBtn} onPress={() => router.push('/(tabs)/shop')}>
                <Text style={styles.shopBtnTxt}>Browse shop</Text>
              </Pressable>
            </View>
          ) : (
            orders.map((tx) => (
              <Pressable
                key={tx.id}
                style={styles.card}
                onPress={() =>
                  router.push({ pathname: '/receipt/[id]', params: { id: tx.id } })
                }>
                <View style={styles.cardTop}>
                  <Text style={styles.orderId}>#{tx.id.slice(0, 8).toUpperCase()}</Text>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.badge,
                        tx.paymentStatus === 'paid' && styles.badgePaid,
                        tx.paymentStatus === 'pending' && styles.badgePending,
                      ]}>
                      <Text style={styles.badgeTxt}>{statusLabel(tx)}</Text>
                    </View>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: `${orderStatusColor(tx.orderStatus ?? 'pending')}22` },
                      ]}>
                      <Text
                        style={[
                          styles.badgeTxt,
                          { color: orderStatusColor(tx.orderStatus ?? 'pending') },
                        ]}>
                        {orderStatusLabel(tx.orderStatus ?? 'pending')}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.date}>{formatDate(tx.createdAt)}</Text>
                <Text style={styles.total}>{formatPeso(tx.total)}</Text>
                <Text style={styles.method}>{paymentMethodLabel(tx.paymentMethod)}</Text>
                {tx.cardLast4 ? (
                  <Text style={styles.detail}>Card ending ···· {tx.cardLast4}</Text>
                ) : null}
                <Text style={styles.items}>
                  {tx.items.length} item{tx.items.length === 1 ? '' : 's'} ·{' '}
                  {tx.items.map((i) => i.name).join(', ')}
                </Text>
                <View style={styles.receiptLink}>
                  <Ionicons name="receipt-outline" size={16} color={FinesseColors.primaryDark} />
                  <Text style={styles.receiptLinkTxt}>View receipt</Text>
                  <Ionicons name="chevron-forward" size={16} color={FinesseColors.textLight} />
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
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
    fontSize: 22,
    color: FinesseColors.secondary,
  },
  scroll: { padding: 16, paddingBottom: 32 },
  err: {
    fontFamily: FinesseFonts.sans,
    color: '#b00020',
    marginBottom: 12,
    textAlign: 'center',
  },
  empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 24 },
  emptyTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 22,
    color: FinesseColors.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: FinesseColors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
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
  card: {
    backgroundColor: FinesseColors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end', flex: 1 },
  orderId: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: FinesseColors.secondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: FinesseColors.border,
  },
  badgePaid: { backgroundColor: 'rgba(168, 140, 94, 0.25)' },
  badgePending: { backgroundColor: 'rgba(184, 148, 47, 0.2)' },
  badgeTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    color: FinesseColors.secondary,
  },
  date: {
    fontFamily: FinesseFonts.sans,
    fontSize: 12,
    color: FinesseColors.textLight,
    marginBottom: 8,
  },
  total: {
    fontFamily: FinesseFonts.serif,
    fontSize: 24,
    color: FinesseColors.primaryDark,
    marginBottom: 4,
  },
  method: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: FinesseColors.text,
    marginBottom: 4,
  },
  detail: {
    fontFamily: FinesseFonts.sans,
    fontSize: 13,
    color: FinesseColors.textLight,
    marginBottom: 4,
  },
  items: {
    fontFamily: FinesseFonts.sans,
    fontSize: 13,
    color: FinesseColors.textLight,
    lineHeight: 18,
    marginTop: 4,
  },
  receiptLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: FinesseColors.border,
  },
  receiptLinkTxt: {
    flex: 1,
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 13,
    color: FinesseColors.primaryDark,
  },
});
