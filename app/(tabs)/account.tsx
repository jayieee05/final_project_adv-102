import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useMobileContentWidth, useTabScrollPadding } from '@/hooks/use-tab-scroll-padding';

const T = {
  ink: '#2c241c',
  inkSoft: '#5c5046',
  inkMuted: 'rgba(44, 36, 28, 0.45)',
  surface: '#ffffff',
  canvasTop: '#fffdfb',
  canvasBot: '#f6f0e8',
  sand: '#ebe3d7',
  line: 'rgba(44, 36, 28, 0.08)',
  gold: '#b8942f',
  goldSoft: 'rgba(184, 148, 47, 0.18)',
  chipBg: '#f3efe8',
};

const softShadow = Platform.select({
  ios: {
    shadowColor: '#1a1410',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
  },
  android: { elevation: 4 },
  default: {},
});

const cardLift = Platform.select({
  ios: {
    shadowColor: '#1a1410',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
  default: {},
});

function greetingLine(name?: string | null) {
  const h = new Date().getHours();
  const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const first = name?.trim()?.split(/\s+/)[0];
  return first ? `${part}, ${first}` : `${part}`;
}

function initials(name?: string | null) {
  const parts = name?.trim().split(/\s+/) ?? [];
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function StatTile({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={[styles.statTile, cardLift]}>
      <Ionicons name={icon} size={20} color={T.gold} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickLink({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.quickLink, cardLift]} onPress={onPress}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={20} color={T.ink} />
      </View>
      <View style={styles.quickText}>
        <Text style={styles.quickTitle}>{title}</Text>
        <Text style={styles.quickSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={T.inkMuted} />
    </Pressable>
  );
}

export default function AccountScreen() {
  const { user, isAuthenticated, isOwner } = useAuth();
  const { getTotalItems } = useCart();
  const scrollPad = useTabScrollPadding(24);
  const { horizontalPad } = useMobileContentWidth();
  const cartCount = getTotalItems();

  if (!isAuthenticated()) {
    return (
      <View style={styles.flex}>
        <LinearGradient colors={[T.canvasTop, T.canvasBot]} style={StyleSheet.absoluteFill} />
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scroll,
              { paddingHorizontal: horizontalPad, paddingBottom: scrollPad },
            ]}>
            <View style={[styles.heroCard, softShadow]}>
              <View style={styles.accentRule} />
              <Text style={styles.kicker}>Finesse boutique</Text>
              <Text style={styles.heroTitle}>Your account</Text>
              <Text style={styles.heroSub}>
                Sign in to save your cart, track orders, and enjoy a more personal shopping
                experience.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Member benefits</Text>
            <View style={[styles.benefitsCard, cardLift]}>
              {[
                { icon: 'heart-outline' as const, text: 'Save favorites and wishlist pieces' },
                { icon: 'bag-handle-outline' as const, text: 'Cart synced across visits' },
                { icon: 'location-outline' as const, text: 'Faster checkout with saved details' },
              ].map((b) => (
                <View key={b.text} style={styles.benefitRow}>
                  <View style={styles.benefitIcon}>
                    <Ionicons name={b.icon} size={18} color={T.gold} />
                  </View>
                  <Text style={styles.benefitTxt}>{b.text}</Text>
                </View>
              ))}
            </View>

            <Pressable style={styles.primaryBtn} onPress={() => router.push('/login')}>
              <Text style={styles.primaryBtnTxt}>LOG IN</Text>
            </Pressable>
            <Pressable style={styles.outlineBtn} onPress={() => router.push('/signup')}>
              <Text style={styles.outlineBtnTxt}>CREATE ACCOUNT</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  const locationLine = [user?.city, user?.country].filter(Boolean).join(', ');

  return (
    <View style={styles.flex}>
      <LinearGradient colors={[T.canvasTop, T.canvasBot]} style={StyleSheet.absoluteFill} />
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: horizontalPad, paddingBottom: scrollPad },
          ]}>
          <View style={[styles.heroCard, softShadow]}>
            <View style={styles.accentRule} />
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTxt}>{initials(user?.name)}</Text>
              </View>
              <View style={styles.profileMeta}>
                <Text style={styles.kicker}>Member profile</Text>
                <Text style={styles.heroTitle}>{greetingLine(user?.name)}</Text>
                <Text style={styles.heroSub} numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatTile label="In cart" value={String(cartCount)} icon="bag-outline" />
            <StatTile label="Status" value="Active" icon="sparkles-outline" />
          </View>

          <Text style={styles.sectionTitle}>Contact & delivery</Text>
          <View style={[styles.sectionCard, cardLift]}>
            {[
              { icon: 'mail-outline' as const, label: 'Email', value: user?.email ?? '—' },
              ...(user?.phone
                ? [{ icon: 'call-outline' as const, label: 'Phone', value: user.phone }]
                : []),
              ...(locationLine
                ? [{ icon: 'location-outline' as const, label: 'Location', value: locationLine }]
                : []),
              ...(user?.address
                ? [{ icon: 'home-outline' as const, label: 'Address', value: user.address }]
                : []),
            ].map((row, i, arr) => (
              <View
                key={row.label}
                style={[styles.infoRow, i === arr.length - 1 && styles.infoRowLast]}>
                <View style={styles.infoIcon}>
                  <Ionicons name={row.icon} size={18} color={T.gold} />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              </View>
            ))}
            {!user?.phone && !locationLine && !user?.address ? (
              <Text style={styles.emptyHint}>
                Add phone and address when you sign up to speed up future orders.
              </Text>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.quickLinks}>
            <QuickLink
              icon="bag-handle-outline"
              title="Browse collection"
              subtitle="Rings, necklaces, earrings & more"
              onPress={() => router.push('/(tabs)/shop')}
            />
            <QuickLink
              icon="receipt-outline"
              title="Orders & payments"
              subtitle="View your transaction history"
              onPress={() => router.push('/orders')}
            />
            {isOwner() ? (
              <QuickLink
                icon="grid-outline"
                title="Owner dashboard"
                subtitle="Manage store and inventory"
                onPress={() => router.push('/dashboard')}
              />
            ) : null}
            <QuickLink
              icon="book-outline"
              title="About Finesse"
              subtitle="Our story and craftsmanship"
              onPress={() => router.push('/(tabs)/about')}
            />
          </View>

          <View style={[styles.noteCard, cardLift]}>
            <Ionicons name="sparkles" size={22} color={T.gold} />
            <Text style={styles.noteTitle}>Thank you for being with us</Text>
            <Text style={styles.noteBody}>
              Your profile helps us personalize recommendations and prepare orders with care. Visit
              the shop anytime to discover new pieces curated for you.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: { paddingTop: 8 },

  heroCard: {
    backgroundColor: T.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: T.line,
    overflow: 'hidden',
  },
  accentRule: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: T.gold,
    opacity: 0.85,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  kicker: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: T.gold,
    marginBottom: 6,
    paddingLeft: 8,
  },
  heroTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 26,
    color: T.ink,
    letterSpacing: -0.3,
    paddingLeft: 8,
  },
  heroSub: {
    marginTop: 8,
    fontFamily: FinesseFonts.sansLight,
    fontSize: 15,
    color: T.inkSoft,
    lineHeight: 22,
    paddingLeft: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingLeft: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: T.goldSoft,
    borderWidth: 1.5,
    borderColor: T.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontFamily: FinesseFonts.serif,
    fontSize: 24,
    color: T.ink,
  },
  profileMeta: { flex: 1 },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  statTile: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.line,
    gap: 6,
  },
  statValue: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 16,
    color: T.ink,
  },
  statLabel: {
    fontFamily: FinesseFonts.sans,
    fontSize: 11,
    color: T.inkMuted,
    textAlign: 'center',
  },

  sectionTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 20,
    color: T.ink,
    marginBottom: 12,
    paddingLeft: 2,
  },
  sectionCard: {
    backgroundColor: T.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: T.line,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.line,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1, paddingTop: 2 },
  infoLabel: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.inkMuted,
    marginBottom: 3,
  },
  infoValue: {
    fontFamily: FinesseFonts.sans,
    fontSize: 15,
    color: T.ink,
    lineHeight: 21,
  },
  emptyHint: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 14,
    color: T.inkMuted,
    lineHeight: 20,
    paddingVertical: 8,
  },

  quickLinks: { gap: 10, marginBottom: 22 },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: T.line,
    gap: 12,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: T.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickText: { flex: 1 },
  quickTitle: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 15,
    color: T.ink,
    marginBottom: 2,
  },
  quickSub: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 13,
    color: T.inkMuted,
  },

  noteCard: {
    backgroundColor: T.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: T.line,
    alignItems: 'center',
    gap: 8,
  },
  noteTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 18,
    color: T.ink,
    textAlign: 'center',
  },
  noteBody: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 14,
    color: T.inkSoft,
    lineHeight: 21,
    textAlign: 'center',
  },

  benefitsCard: {
    backgroundColor: T.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: T.line,
    gap: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTxt: {
    flex: 1,
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: T.inkSoft,
    lineHeight: 20,
  },

  primaryBtn: {
    backgroundColor: T.ink,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 12,
  },
  primaryBtnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: '#fff',
    fontSize: 13,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: T.ink,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  outlineBtnTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 1.5,
    color: T.ink,
    fontSize: 13,
  },
});
