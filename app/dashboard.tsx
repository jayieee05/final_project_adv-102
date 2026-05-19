import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeleteOrderModal } from '@/components/finesse/delete-order-modal';
import { FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { formatPeso } from '@/lib/format-currency';
import {
  ORDER_STATUS_FILTERS,
  orderStatusColor,
  orderStatusLabel,
} from '@/lib/order-status';
import { setPendingReceipt } from '@/lib/pending-receipt';
import {
  deleteTransaction,
  fetchAllTransactions,
  paymentMethodLabel,
  updateOrderStatus,
} from '@/lib/transactions';
import type { OrderStatus, Transaction } from '@/types/transaction';

const STATUS_ACTIONS: OrderStatus[] = ['pending', 'completed', 'returned'];

const T = {
  ink: '#2c241c',
  inkSoft: '#5c5046',
  inkMuted: 'rgba(44, 36, 28, 0.45)',
  surface: '#ffffff',
  canvasTop: '#fffdfb',
  canvasBot: '#f3ebe0',
  line: 'rgba(44, 36, 28, 0.1)',
  gold: '#b8942f',
  goldSoft: 'rgba(184, 148, 47, 0.15)',
};

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <View style={[styles.statCard, { borderLeftColor: accent }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function OrderCard({
  order,
  onStatusChange,
  onDelete,
  updating,
}: {
  order: Transaction;
  onStatusChange: (status: OrderStatus) => void;
  onDelete: () => void;
  updating: boolean;
}) {
  const currentStatus = order.orderStatus ?? 'pending';
  const statusColor = orderStatusColor(currentStatus);
  const itemSummary = order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ');

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderTop}>
        <View>
          <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.orderWhen}>{formatWhen(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22` }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusBadgeTxt, { color: statusColor }]}>
            {orderStatusLabel(currentStatus)}
          </Text>
        </View>
      </View>

      <Text style={styles.customerName}>{order.userName}</Text>
      <Text style={styles.customerMeta}>{order.userEmail}</Text>
      {order.shippingCity ? (
        <Text style={styles.customerMeta}>
          {[order.shippingAddress, order.shippingCity].filter(Boolean).join(', ')}
        </Text>
      ) : null}

      <Text style={styles.items} numberOfLines={2}>
        {itemSummary}
      </Text>

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.total}>{formatPeso(order.total)}</Text>
          <Text style={styles.payMeta}>
            {paymentMethodLabel(order.paymentMethod)}
            {order.paymentStatus === 'pending' ? ' · Payment pending' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.receiptBtn}
          activeOpacity={0.7}
          onPress={() => {
            setPendingReceipt(order);
            router.push({ pathname: '/receipt/[id]', params: { id: order.id } });
          }}>
          <Ionicons name="receipt-outline" size={16} color={T.ink} />
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        {STATUS_ACTIONS.map((status) => {
          const isActive = currentStatus === status;
          const style =
            status === 'pending'
              ? styles.actionPending
              : status === 'completed'
                ? styles.actionDone
                : styles.actionReturn;
          return (
            <TouchableOpacity
              key={status}
              style={[styles.actionBtn, style, isActive && styles.actionBtnActive]}
              activeOpacity={0.7}
              disabled={updating || isActive}
              onPress={() => onStatusChange(status)}>
              <Text style={[styles.actionBtnTxt, isActive && styles.actionBtnTxtActive]}>
                {orderStatusLabel(status)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        activeOpacity={0.7}
        disabled={updating}
        onPress={onDelete}>
        <Ionicons name="trash-outline" size={16} color="#8b4a4a" />
        <Text style={styles.deleteBtnTxt}>Delete order</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DashboardScreen() {
  const { user, isOwner, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const load = useCallback(async () => {
    const data = await fetchAllTransactions();
    setOrders(data);
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    if (!isOwner()) return;
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [isAuthenticated, isOwner, load]);

  const counts = useMemo(() => {
    const pending = orders.filter((o) => (o.orderStatus ?? 'pending') === 'pending').length;
    const completed = orders.filter((o) => o.orderStatus === 'completed').length;
    const returned = orders.filter((o) => o.orderStatus === 'returned').length;
    const revenue = orders
      .filter((o) => o.orderStatus !== 'returned')
      .reduce((sum, o) => sum + o.total, 0);
    return { pending, completed, returned, revenue, all: orders.length };
  }, [orders]);

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => (o.orderStatus ?? 'pending') === filter);
  }, [orders, filter]);

  const handleStatusChange = async (order: Transaction, status: OrderStatus) => {
    if ((order.orderStatus ?? 'pending') === status) return;
    setUpdateError('');
    setUpdatingId(order.id);
    const result = await updateOrderStatus(order.id, status, order.userId);
    setUpdatingId(null);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, orderStatus: status } : o)),
      );
    } else {
      setUpdateError(result.error);
    }
  };

  const handleDelete = (order: Transaction) => {
    setDeleteTarget(order);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setUpdateError('');
    setUpdatingId(deleteTarget.id);
    const result = await deleteTransaction(deleteTarget.id, deleteTarget.userId);
    setUpdatingId(null);
    if (result.success) {
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      setUpdateError(result.error);
    }
  };

  if (!isOwner()) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backTxt}>← Back</Text>
        </Pressable>
        <View style={styles.deniedWrap}>
          <Ionicons name="lock-closed-outline" size={40} color={T.inkMuted} />
          <Text style={styles.denied}>This area is for store owners only.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.flex}>
      <LinearGradient colors={[T.canvasTop, T.canvasBot]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color={T.ink} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.kicker}>Admin</Text>
            <Text style={styles.title}>Order dashboard</Text>
          </View>
          <Pressable onPress={() => void load()} hitSlop={12}>
            <Ionicons name="refresh-outline" size={24} color={T.ink} />
          </Pressable>
        </View>

        <Text style={styles.welcome}>Hello, {user?.name?.split(' ')[0] ?? 'Owner'}</Text>

        {loading ? (
          <ActivityIndicator color={T.gold} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true);
                  await load();
                  setRefreshing(false);
                }}
              />
            }>
            <View style={styles.statsRow}>
              <StatCard label="Pending" value={String(counts.pending)} accent={orderStatusColor('pending')} />
              <StatCard label="Completed" value={String(counts.completed)} accent={orderStatusColor('completed')} />
            </View>
            <View style={styles.statsRow}>
              <StatCard label="Returned" value={String(counts.returned)} accent={orderStatusColor('returned')} />
              <StatCard label="Revenue" value={formatPeso(counts.revenue)} accent={T.gold} />
            </View>

            {updateError ? <Text style={styles.updateErr}>{updateError}</Text> : null}

            <View style={styles.filters}>
              {ORDER_STATUS_FILTERS.map((f) => (
                <Pressable
                  key={f.id}
                  style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
                  onPress={() => setFilter(f.id)}>
                  <Text style={[styles.filterTxt, filter === f.id && styles.filterTxtActive]}>
                    {f.label}
                    {f.id === 'all'
                      ? ` (${counts.all})`
                      : ` (${counts[f.id as OrderStatus]})`}
                  </Text>
                </Pressable>
              ))}
            </View>

            {filtered.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="file-tray-outline" size={44} color={T.inkMuted} />
                <Text style={styles.emptyTitle}>No {filter === 'all' ? '' : filter} orders</Text>
                <Text style={styles.emptySub}>
                  Customer orders will appear here after checkout.
                </Text>
              </View>
            ) : (
              filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  updating={updatingId === order.id}
                  onStatusChange={(status) => void handleStatusChange(order, status)}
                  onDelete={() => handleDelete(order)}
                />
              ))
            )}
          </ScrollView>
        )}

        <DeleteOrderModal
          visible={deleteTarget !== null}
          order={deleteTarget}
          loading={deleteTarget !== null && updatingId === deleteTarget.id}
          onCancel={() => !updatingId && setDeleteTarget(null)}
          onConfirm={() => void confirmDelete()}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  back: { padding: 16 },
  backTxt: { fontFamily: FinesseFonts.sansMedium, color: T.gold, fontSize: 16 },
  deniedWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 12 },
  denied: {
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    color: T.inkSoft,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  kicker: {
    fontFamily: FinesseFonts.sans,
    fontSize: 10,
    letterSpacing: 2,
    color: T.gold,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 24,
    color: T.ink,
  },
  welcome: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: T.inkSoft,
    textAlign: 'center',
    marginBottom: 12,
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: T.line,
    borderLeftWidth: 4,
  },
  statValue: {
    fontFamily: FinesseFonts.serif,
    fontSize: 22,
    color: T.ink,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    color: T.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  updateErr: {
    fontFamily: FinesseFonts.sans,
    fontSize: 13,
    color: '#8b4a4a',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: T.line,
    backgroundColor: T.surface,
  },
  filterChipActive: {
    backgroundColor: T.ink,
    borderColor: T.ink,
  },
  filterTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    color: T.inkSoft,
  },
  filterTxtActive: { color: T.surface },
  empty: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 24 },
  emptyTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 20,
    color: T.ink,
    marginTop: 12,
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: T.inkSoft,
    textAlign: 'center',
    lineHeight: 20,
  },
  orderCard: {
    backgroundColor: T.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: T.line,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderId: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: T.ink,
  },
  orderWhen: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    color: T.inkMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  customerName: {
    fontFamily: FinesseFonts.serif,
    fontSize: 18,
    color: T.ink,
    marginBottom: 2,
  },
  customerMeta: {
    fontFamily: FinesseFonts.sans,
    fontSize: 12,
    color: T.inkSoft,
    lineHeight: 17,
  },
  items: {
    fontFamily: FinesseFonts.sans,
    fontSize: 12,
    color: T.inkMuted,
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 17,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: T.line,
  },
  total: {
    fontFamily: FinesseFonts.serif,
    fontSize: 20,
    color: T.gold,
  },
  payMeta: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    color: T.inkSoft,
    marginTop: 2,
  },
  receiptBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, zIndex: 2 },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    minHeight: 40,
    justifyContent: 'center',
  },
  actionBtnActive: {
    borderWidth: 2,
    borderColor: T.ink,
    opacity: 0.85,
  },
  actionPending: { backgroundColor: 'rgba(184, 148, 47, 0.2)' },
  actionDone: { backgroundColor: 'rgba(90, 122, 82, 0.2)' },
  actionReturn: { backgroundColor: 'rgba(139, 74, 74, 0.2)' },
  actionBtnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    color: T.ink,
    letterSpacing: 0.3,
  },
  actionBtnTxtActive: { color: T.inkSoft },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 74, 74, 0.35)',
    backgroundColor: 'rgba(139, 74, 74, 0.08)',
  },
  deleteBtnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    color: '#8b4a4a',
    letterSpacing: 0.3,
  },
});
