import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';
import { FinesseColors } from '@/constants/finesse-theme';

function OrderCardSkeleton() {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderTop}>
        <View style={styles.col}>
          <Skeleton width={100} height={12} />
          <Skeleton width={72} height={10} style={{ marginTop: 6 }} />
        </View>
        <Skeleton width={88} height={26} borderRadius={999} />
      </View>
      <Skeleton width="55%" height={18} style={{ marginTop: 12 }} />
      <Skeleton width="70%" height={12} style={{ marginTop: 6 }} />
      <Skeleton width="90%" height={12} style={{ marginTop: 4 }} />
      <Skeleton width="100%" height={32} style={{ marginTop: 12 }} />
      <View style={styles.footerRow}>
        <View>
          <Skeleton width={80} height={20} />
          <Skeleton width={120} height={10} style={{ marginTop: 6 }} />
        </View>
        <Skeleton width={36} height={36} borderRadius={18} />
      </View>
      <View style={styles.actionRow}>
        <Skeleton width="30%" height={40} borderRadius={6} />
        <Skeleton width="30%" height={40} borderRadius={6} />
        <Skeleton width="30%" height={40} borderRadius={6} />
      </View>
      <Skeleton width="100%" height={40} borderRadius={6} style={{ marginTop: 10 }} />
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.dashboardScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Skeleton width="60%" height={24} />
          <Skeleton width="50%" height={10} style={{ marginTop: 8 }} />
        </View>
        <View style={styles.statCard}>
          <Skeleton width="60%" height={24} />
          <Skeleton width="50%" height={10} style={{ marginTop: 8 }} />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Skeleton width="60%" height={24} />
          <Skeleton width="50%" height={10} style={{ marginTop: 8 }} />
        </View>
        <View style={styles.statCard}>
          <Skeleton width="60%" height={24} />
          <Skeleton width="50%" height={10} style={{ marginTop: 8 }} />
        </View>
      </View>
      <View style={styles.filterRow}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width={72} height={34} borderRadius={999} />
        ))}
      </View>
      {Array.from({ length: 3 }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </ScrollView>
  );
}

export function OrdersListSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.ordersScroll} showsVerticalScrollIndicator={false}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={styles.orderListCard}>
          <View style={styles.orderTop}>
            <Skeleton width={90} height={12} />
            <View style={styles.badgeRow}>
              <Skeleton width={56} height={22} borderRadius={4} />
              <Skeleton width={64} height={22} borderRadius={4} />
            </View>
          </View>
          <Skeleton width={60} height={10} style={{ marginTop: 8 }} />
          <Skeleton width={100} height={22} style={{ marginTop: 10 }} />
          <Skeleton width={140} height={12} style={{ marginTop: 6 }} />
          <Skeleton width="100%" height={28} style={{ marginTop: 10 }} />
          <Skeleton width={120} height={14} style={{ marginTop: 12 }} />
        </View>
      ))}
    </ScrollView>
  );
}

export function ReceiptSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.receiptScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.receiptPaper}>
        <Skeleton width="100%" height={6} borderRadius={0} />
        <View style={styles.receiptInner}>
          <View style={styles.receiptBrand}>
            <Skeleton width={44} height={44} borderRadius={22} />
            <View style={styles.col}>
              <Skeleton width={120} height={28} />
              <Skeleton width={100} height={10} style={{ marginTop: 6 }} />
            </View>
          </View>
          <Skeleton width={160} height={20} style={{ alignSelf: 'center', marginTop: 12 }} />
          <Skeleton width={200} height={12} style={{ alignSelf: 'center', marginTop: 8 }} />
          <Skeleton width={140} height={28} borderRadius={999} style={{ alignSelf: 'center', marginTop: 14 }} />
          <Skeleton width="100%" height={1} style={{ marginVertical: 16 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={i} style={styles.receiptLine}>
              <Skeleton width="65%" height={14} />
              <Skeleton width={60} height={14} />
            </View>
          ))}
          <Skeleton width="100%" height={1} style={{ marginVertical: 14 }} />
          <View style={styles.receiptLine}>
            <Skeleton width={80} height={14} />
            <Skeleton width={70} height={20} />
          </View>
          <Skeleton width={56} height={56} borderRadius={28} style={{ alignSelf: 'center', marginTop: 20 }} />
        </View>
      </View>
    </ScrollView>
  );
}

function CartLineSkeleton() {
  return (
    <View style={styles.cartRow}>
      <Skeleton width={88} height={88} borderRadius={4} />
      <View style={styles.cartInfo}>
        <Skeleton width="80%" height={16} />
        <Skeleton width={50} height={14} style={{ marginTop: 8 }} />
        <View style={styles.qtyRow}>
          <Skeleton width={32} height={32} borderRadius={4} />
          <Skeleton width={24} height={16} />
          <Skeleton width={32} height={32} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

export function CartSkeleton() {
  return (
    <View style={styles.cartWrap}>
      {Array.from({ length: 3 }).map((_, i) => (
        <CartLineSkeleton key={i} />
      ))}
      <View style={styles.cartFooter}>
        <View style={styles.receiptLine}>
          <Skeleton width={100} height={14} />
          <Skeleton width={70} height={14} />
        </View>
        <View style={styles.receiptLine}>
          <Skeleton width={80} height={14} />
          <Skeleton width={60} height={14} />
        </View>
        <View style={[styles.receiptLine, { marginTop: 8 }]}>
          <Skeleton width={60} height={18} />
          <Skeleton width={90} height={22} />
        </View>
        <Skeleton width="100%" height={48} borderRadius={2} style={{ marginTop: 14 }} />
      </View>
    </View>
  );
}

export function CheckoutSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.checkoutScroll} showsVerticalScrollIndicator={false}>
      <Skeleton width={100} height={12} style={{ marginBottom: 10 }} />
      <View style={styles.checkoutCard}>
        {Array.from({ length: 2 }).map((_, i) => (
          <View key={i} style={styles.checkoutItem}>
            <Skeleton width={56} height={56} borderRadius={4} />
            <View style={styles.col}>
              <Skeleton width="70%" height={14} />
              <Skeleton width={80} height={12} style={{ marginTop: 6 }} />
            </View>
          </View>
        ))}
        <Skeleton width="100%" height={1} style={{ marginVertical: 12 }} />
        <View style={styles.receiptLine}>
          <Skeleton width={70} height={12} />
          <Skeleton width={60} height={12} />
        </View>
        <View style={styles.receiptLine}>
          <Skeleton width={60} height={18} />
          <Skeleton width={80} height={22} />
        </View>
      </View>
      <Skeleton width={120} height={12} style={{ marginTop: 16, marginBottom: 10 }} />
      <View style={styles.checkoutCard}>
        <Skeleton width="50%" height={16} />
        <Skeleton width="80%" height={12} style={{ marginTop: 8 }} />
        <Skeleton width="60%" height={12} style={{ marginTop: 4 }} />
      </View>
      <Skeleton width={140} height={12} style={{ marginTop: 16, marginBottom: 10 }} />
      <View style={styles.methodRow}>
        <Skeleton width="30%" height={40} borderRadius={8} />
        <Skeleton width="30%" height={40} borderRadius={8} />
        <Skeleton width="30%" height={40} borderRadius={8} />
      </View>
      <View style={styles.checkoutCard}>
        <Skeleton width="40%" height={12} />
        <Skeleton width="100%" height={44} style={{ marginTop: 8 }} />
        <Skeleton width="100%" height={44} style={{ marginTop: 10 }} />
      </View>
    </ScrollView>
  );
}

export function AccountProfileSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.accountScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.accountHero}>
        <Skeleton width={52} height={52} borderRadius={26} />
        <View style={[styles.col, { marginLeft: 14 }]}>
          <Skeleton width={100} height={10} />
          <Skeleton width={180} height={22} style={{ marginTop: 8 }} />
          <Skeleton width={140} height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Skeleton width={40} height={20} />
          <Skeleton width={60} height={10} style={{ marginTop: 6 }} />
        </View>
        <View style={styles.statCard}>
          <Skeleton width={40} height={20} />
          <Skeleton width={60} height={10} style={{ marginTop: 6 }} />
        </View>
      </View>
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} style={styles.accountCard}>
          <Skeleton width={36} height={36} borderRadius={12} />
          <View style={[styles.col, { marginLeft: 12 }]}>
            <Skeleton width="70%" height={14} />
            <Skeleton width="50%" height={11} style={{ marginTop: 6 }} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View style={styles.productGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.productCard}>
          <Skeleton width="100%" height={140} borderRadius={12} />
          <Skeleton width="85%" height={14} style={{ marginTop: 10 }} />
          <Skeleton width="50%" height={12} style={{ marginTop: 6 }} />
          <Skeleton width="40%" height={16} style={{ marginTop: 8 }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  col: { flex: 1 },
  dashboardScroll: { padding: 16, paddingBottom: 32 },
  ordersScroll: { padding: 16, paddingBottom: 32 },
  receiptScroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  checkoutScroll: { padding: 16, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  statCard: {
    flex: 1,
    backgroundColor: FinesseColors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingVertical: 14 },
  orderCard: {
    backgroundColor: FinesseColors.background,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  orderListCard: {
    backgroundColor: FinesseColors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badgeRow: { flexDirection: 'row', gap: 6 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: FinesseColors.border,
  },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  receiptPaper: {
    backgroundColor: FinesseColors.background,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  receiptInner: { padding: 22 },
  receiptBrand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  receiptLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cartWrap: { flex: 1, padding: 16 },
  cartRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: FinesseColors.border,
  },
  cartInfo: { flex: 1 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  cartFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: FinesseColors.border,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  checkoutCard: {
    backgroundColor: FinesseColors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: FinesseColors.border,
    marginBottom: 4,
  },
  checkoutItem: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  methodRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  productCard: {
    width: '47%',
    marginBottom: 8,
  },
  accountScroll: { padding: 16, paddingBottom: 32 },
  accountHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinesseColors.background,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinesseColors.background,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
});
