import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { ScalePressable } from '@/components/ui/motion';
import { FinesseFonts } from '@/constants/finesse-theme';
import { MotionSpring } from '@/constants/motion';
import { formatPeso } from '@/lib/format-currency';
import { orderStatusLabel } from '@/lib/order-status';
import { paymentMethodLabel } from '@/lib/transactions';
import type { Transaction } from '@/types/transaction';

type DeleteOrderModalProps = {
  visible: boolean;
  order: Transaction | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteOrderModal({
  visible,
  order,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteOrderModalProps) {
  if (!order) return null;

  const orderRef = `#${order.id.slice(0, 8).toUpperCase()}`;
  const status = order.orderStatus ?? 'pending';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Animated.View entering={FadeIn.duration(220)} style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={loading ? undefined : onCancel} />
        <Animated.View
          entering={ZoomIn.springify()
            .damping(MotionSpring.bouncy.damping)
            .stiffness(200)}
          style={styles.cardWrap}>
          <View style={styles.card} onStartShouldSetResponder={() => true}>
            <LinearGradient
              colors={['#8b4a4a', '#a85c5c', '#c47a7a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.topBand}
            />

            <View style={styles.iconRing}>
              <LinearGradient
                colors={['rgba(196, 122, 122, 0.25)', 'rgba(139, 74, 74, 0.12)']}
                style={styles.iconRingBg}>
                <View style={styles.iconInner}>
                  <Ionicons name="trash" size={28} color="#8b4a4a" />
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.brand}>FINESSE</Text>
            <Text style={styles.title}>Remove this order?</Text>
            <Text style={styles.subtitle}>
              This action is permanent. The receipt and order record will be removed from your
              dashboard.
            </Text>

            <View style={styles.orderPreview}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Order</Text>
                <Text style={styles.previewValue}>{orderRef}</Text>
              </View>
              <View style={styles.previewDivider} />
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Customer</Text>
                <Text style={styles.previewValue} numberOfLines={1}>
                  {order.userName}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Total</Text>
                <Text style={styles.previewValueGold}>{formatPeso(order.total)}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Status</Text>
                <Text style={styles.previewValue}>{orderStatusLabel(status)}</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Payment</Text>
                <Text style={styles.previewValue}>{paymentMethodLabel(order.paymentMethod)}</Text>
              </View>
            </View>

            <View style={styles.warningRow}>
              <Ionicons name="alert-circle-outline" size={16} color="#8b4a4a" />
              <Text style={styles.warningTxt}>Cannot be undone</Text>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={[styles.cancelBtn, loading && styles.btnDisabled]}
                onPress={onCancel}
                disabled={loading}>
                <Text style={styles.cancelTxt}>Keep order</Text>
              </Pressable>
              <ScalePressable
                style={[styles.deleteBtn, loading && styles.btnDisabled]}
                onPress={onConfirm}
                disabled={loading}
                haptic={!loading}>
                <LinearGradient
                  colors={['#7a3f3f', '#8b4a4a', '#a85c5c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.deleteGradient}>
                  {loading ? (
                    <ActivityIndicator color="#fffdf8" size="small" />
                  ) : (
                    <>
                      <Ionicons name="trash-outline" size={18} color="#fffdf8" />
                      <Text style={styles.deleteTxt}>Delete forever</Text>
                    </>
                  )}
                </LinearGradient>
              </ScalePressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 20, 16, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardWrap: { width: '100%', maxWidth: 380 },
  card: {
    backgroundColor: '#fffdf8',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(44, 36, 28, 0.12)',
    shadowColor: '#1a1410',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 16,
    paddingBottom: 22,
  },
  topBand: { height: 5, width: '100%' },
  iconRing: { alignItems: 'center', marginTop: -28, marginBottom: 8 },
  iconRingBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 74, 74, 0.35)',
  },
  iconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fffdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: FinesseFonts.serif,
    fontSize: 14,
    letterSpacing: 5,
    color: '#b8942f',
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 26,
    color: '#2c241c',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FinesseFonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: '#5c5046',
    textAlign: 'center',
    paddingHorizontal: 22,
    marginBottom: 18,
  },
  orderPreview: {
    marginHorizontal: 20,
    backgroundColor: '#f9f6f2',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e0d5',
    marginBottom: 14,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 5,
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#e5e0d5',
    marginVertical: 6,
  },
  previewLabel: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    letterSpacing: 0.8,
    color: '#5c5046',
    textTransform: 'uppercase',
  },
  previewValue: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 13,
    color: '#2c241c',
    flex: 1,
    textAlign: 'right',
  },
  previewValueGold: {
    fontFamily: FinesseFonts.serif,
    fontSize: 16,
    color: '#a88c5e',
    flex: 1,
    textAlign: 'right',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 18,
  },
  warningTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: '#8b4a4a',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#4a3c2d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    color: '#4a3c2d',
  },
  deleteBtn: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  deleteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    minHeight: 48,
  },
  deleteTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 13,
    letterSpacing: 0.8,
    color: '#fffdf8',
  },
  btnDisabled: { opacity: 0.65 },
});
