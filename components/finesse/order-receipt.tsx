import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FadeInView, PopInView } from '@/components/ui/motion';
import { FinesseFonts } from '@/constants/finesse-theme';
import { formatPeso } from '@/lib/format-currency';
import {
  formatReceiptDate,
  receiptNumberFromId,
  receiptStatusLabel,
} from '@/lib/receipt-format';
import { orderStatusLabel } from '@/lib/order-status';
import { paymentMethodLabel } from '@/lib/transactions';
import type { Transaction } from '@/types/transaction';

const INK = '#2c241c';
const INK_SOFT = '#5c5046';
const PAPER = '#fffdf8';
const PAPER_SHADOW = '#ebe3d7';
const GOLD = '#b8942f';
const GOLD_LIGHT = '#d4b86a';
const GOLD_DEEP = '#8a6d22';

function DashedRule() {
  return (
    <View style={styles.dashRow}>
      {Array.from({ length: 28 }).map((_, i) => (
        <View key={i} style={styles.dash} />
      ))}
    </View>
  );
}

function Perforation() {
  return (
    <View style={styles.perfRow}>
      {Array.from({ length: 18 }).map((_, i) => (
        <View key={i} style={styles.perfDot} />
      ))}
    </View>
  );
}

function BarcodeStrip({ code }: { code: string }) {
  const bars = code.split('').map((c) => (c.charCodeAt(0) % 5) + 1);
  return (
    <View style={styles.barcodeWrap}>
      <View style={styles.barcode}>
        {bars.map((w, i) => (
          <View key={i} style={[styles.bar, { flex: w, opacity: i % 2 === 0 ? 1 : 0.55 }]} />
        ))}
      </View>
      <Text style={styles.barcodeTxt}>{code.replace(/-/g, '')}</Text>
    </View>
  );
}

function LineItem({
  name,
  qty,
  lineTotal,
}: {
  name: string;
  qty: number;
  lineTotal: number;
}) {
  return (
    <View style={styles.lineItem}>
      <View style={styles.lineTop}>
        <Text style={styles.lineName} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.linePrice}>{formatPeso(lineTotal)}</Text>
      </View>
      <Text style={styles.lineQty}>× {qty}</Text>
    </View>
  );
}

type OrderReceiptProps = {
  transaction: Transaction;
  showCelebration?: boolean;
};

export function OrderReceipt({ transaction, showCelebration }: OrderReceiptProps) {
  const receiptNo = receiptNumberFromId(transaction.id);
  const isPaid = transaction.paymentStatus === 'paid';
  const shippingLine = [transaction.shippingAddress, transaction.shippingCity]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.outer}>
      {showCelebration ? (
        <PopInView style={styles.celebration}>
          <Ionicons name="sparkles" size={18} color={GOLD_LIGHT} />
          <Text style={styles.celebrationTxt}>Thank you for your purchase</Text>
          <Ionicons name="sparkles" size={18} color={GOLD_LIGHT} />
        </PopInView>
      ) : null}

      <FadeInView from="fade" index={showCelebration ? 1 : 0} style={styles.paper}>
        <LinearGradient
          colors={[GOLD_DEEP, GOLD, GOLD_LIGHT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.goldBand}
        />
        <View style={styles.paperInner}>
          <View style={styles.brandRow}>
            <View style={styles.diamond}>
              <Ionicons name="diamond-outline" size={22} color={GOLD} />
            </View>
            <View>
              <Text style={styles.brand}>FINESSE</Text>
              <Text style={styles.brandSub}>Fine Jewelry Boutique</Text>
            </View>
          </View>

          <Text style={styles.docTitle}>Purchase Receipt</Text>
          <Text style={styles.tagline}>Crafting timeless elegance</Text>

          <DashedRule />

          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Receipt no.</Text>
              <Text style={styles.metaValue}>{receiptNo}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValueSmall}>{formatReceiptDate(transaction.createdAt)}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusPill,
              isPaid ? styles.statusPaid : styles.statusPending,
            ]}>
            <Ionicons
              name={isPaid ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={isPaid ? GOLD_DEEP : INK_SOFT}
            />
            <Text style={[styles.statusTxt, isPaid && styles.statusTxtPaid]}>
              {receiptStatusLabel(transaction)}
            </Text>
          </View>
          <Text style={styles.fulfillmentStatus}>
            Order · {orderStatusLabel(transaction.orderStatus ?? 'pending')}
          </Text>

          <DashedRule />

          <Text style={styles.sectionHead}>Customer</Text>
          <Text style={styles.bodyStrong}>{transaction.userName}</Text>
          <Text style={styles.body}>{transaction.userEmail}</Text>
          {transaction.shippingPhone ? (
            <Text style={styles.body}>{transaction.shippingPhone}</Text>
          ) : null}
          {shippingLine ? <Text style={styles.body}>{shippingLine}</Text> : null}

          <DashedRule />

          <Text style={styles.sectionHead}>Items</Text>
          {transaction.items.map((item) => (
            <LineItem
              key={`${item.id}-${item.size}-${item.material}`}
              name={item.name}
              qty={item.quantity}
              lineTotal={item.priceValue * item.quantity}
            />
          ))}

          <DashedRule />

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalVal}>{formatPeso(transaction.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalVal}>{formatPeso(transaction.shipping)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandRow]}>
              <Text style={styles.grandLabel}>Total paid</Text>
              <Text style={styles.grandVal}>{formatPeso(transaction.total)}</Text>
            </View>
          </View>

          <DashedRule />

          <Text style={styles.sectionHead}>Payment</Text>
          <Text style={styles.body}>{paymentMethodLabel(transaction.paymentMethod)}</Text>
          {transaction.cardLast4 ? (
            <Text style={styles.body}>Card ···· {transaction.cardLast4}</Text>
          ) : null}

          <View style={styles.seal}>
            <LinearGradient
              colors={[GOLD_LIGHT, GOLD, GOLD_DEEP]}
              style={styles.sealRing}>
              <View style={styles.sealInner}>
                <Ionicons name="ribbon" size={28} color={GOLD_DEEP} />
              </View>
            </LinearGradient>
            <Text style={styles.sealTxt}>Authentic Finesse Order</Text>
          </View>

          <BarcodeStrip code={receiptNo} />

          <Text style={styles.footerNote}>
            Keep this receipt for your records. For order inquiries, contact us with your receipt
            number.
          </Text>
          <Text style={styles.footerThanks}>— With gratitude, Team Finesse —</Text>
        </View>

        <Perforation />
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  celebration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  celebrationTxt: {
    fontFamily: FinesseFonts.serif,
    fontSize: 18,
    color: GOLD_LIGHT,
    letterSpacing: 0.5,
  },
  paper: {
    backgroundColor: PAPER,
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#1a1410',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: PAPER_SHADOW,
  },
  goldBand: { height: 6, width: '100%' },
  paperInner: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 8 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  diamond: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(184, 148, 47, 0.12)',
  },
  brand: {
    fontFamily: FinesseFonts.serif,
    fontSize: 32,
    letterSpacing: 6,
    color: INK,
  },
  brandSub: {
    fontFamily: FinesseFonts.sans,
    fontSize: 10,
    letterSpacing: 2,
    color: INK_SOFT,
    textTransform: 'uppercase',
  },
  docTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 20,
    color: INK,
    textAlign: 'center',
    marginTop: 4,
  },
  tagline: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 12,
    color: INK_SOFT,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 14,
  },
  dashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    overflow: 'hidden',
  },
  dash: {
    width: 6,
    height: 1,
    backgroundColor: INK_SOFT,
    opacity: 0.35,
  },
  metaGrid: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  metaCell: { flex: 1 },
  metaLabel: {
    fontFamily: FinesseFonts.sans,
    fontSize: 9,
    letterSpacing: 1.2,
    color: INK_SOFT,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: INK,
    letterSpacing: 0.5,
  },
  metaValueSmall: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    color: INK,
    lineHeight: 15,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 4,
  },
  statusPaid: { backgroundColor: 'rgba(184, 148, 47, 0.18)' },
  statusPending: { backgroundColor: 'rgba(92, 80, 70, 0.1)' },
  statusTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1.5,
    color: INK_SOFT,
  },
  statusTxtPaid: { color: GOLD_DEEP },
  fulfillmentStatus: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: INK_SOFT,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionHead: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 9,
    letterSpacing: 2,
    color: GOLD_DEEP,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  bodyStrong: {
    fontFamily: FinesseFonts.serif,
    fontSize: 17,
    color: INK,
    marginBottom: 2,
  },
  body: {
    fontFamily: FinesseFonts.sans,
    fontSize: 12,
    color: INK_SOFT,
    lineHeight: 18,
    marginBottom: 2,
  },
  lineItem: { marginBottom: 10 },
  lineTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  lineName: {
    fontFamily: FinesseFonts.serif,
    fontSize: 15,
    color: INK,
    flex: 1,
  },
  linePrice: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 13,
    color: INK,
  },
  lineQty: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    color: INK_SOFT,
    marginTop: 2,
  },
  totals: { marginTop: 4 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: { fontFamily: FinesseFonts.sans, fontSize: 13, color: INK_SOFT },
  totalVal: { fontFamily: FinesseFonts.sansMedium, fontSize: 13, color: INK },
  grandRow: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: PAPER_SHADOW,
  },
  grandLabel: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: INK,
  },
  grandVal: {
    fontFamily: FinesseFonts.serif,
    fontSize: 22,
    color: GOLD_DEEP,
  },
  seal: { alignItems: 'center', marginVertical: 18 },
  sealRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
    marginBottom: 8,
  },
  sealInner: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: PAPER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealTxt: {
    fontFamily: FinesseFonts.sans,
    fontSize: 10,
    letterSpacing: 1.5,
    color: INK_SOFT,
    textTransform: 'uppercase',
  },
  barcodeWrap: { alignItems: 'center', marginBottom: 14 },
  barcode: {
    flexDirection: 'row',
    height: 36,
    width: '88%',
    gap: 2,
    marginBottom: 6,
    alignItems: 'stretch',
  },
  bar: { backgroundColor: INK, borderRadius: 1, minWidth: 2 },
  barcodeTxt: {
    fontFamily: FinesseFonts.sans,
    fontSize: 9,
    letterSpacing: 3,
    color: INK_SOFT,
  },
  footerNote: {
    fontFamily: FinesseFonts.sans,
    fontSize: 10,
    color: INK_SOFT,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 10,
  },
  footerThanks: {
    fontFamily: FinesseFonts.serif,
    fontSize: 13,
    color: GOLD_DEEP,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  perfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 6,
    backgroundColor: PAPER,
  },
  perfDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2a2118',
    marginTop: -5,
  },
});
