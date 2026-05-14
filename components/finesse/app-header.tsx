import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useMobileContentWidth } from '@/hooks/use-tab-scroll-padding';

export function AppHeader() {
  const { user, logout, isAuthenticated, isOwner } = useAuth();
  const { getTotalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const count = getTotalItems();
  const { width, horizontalPad, isNarrow } = useMobileContentWidth();
  const compactAuth = width < 360;

  return (
    <>
      <View style={[styles.bar, { paddingHorizontal: horizontalPad, paddingVertical: isNarrow ? 10 : 12 }]}>
        <Pressable onPress={() => router.push('/')} style={styles.logoWrap} hitSlop={8}>
          <Text style={[styles.logoText, compactAuth && styles.logoTextSmall]}>Finesse</Text>
        </Pressable>

        <View style={[styles.actions, compactAuth && { gap: 6 }]}>
          {isAuthenticated() && (
            <Pressable
              onPress={() => router.push('/cart')}
              style={styles.iconBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Open shopping cart">
              <Ionicons name="bag-outline" size={isNarrow ? 22 : 24} color={FinesseColors.secondary} />
              {count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
                </View>
              )}
            </Pressable>
          )}

          {isAuthenticated() ? (
            <Pressable
              onPress={() => setMenuOpen(true)}
              style={styles.userBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityLabel="User menu">
              <Ionicons name="person-outline" size={isNarrow ? 22 : 22} color={FinesseColors.secondary} />
              {!compactAuth && (
                <Text style={styles.userFirst} numberOfLines={1}>
                  {user?.name?.split(' ')[0]}
                </Text>
              )}
            </Pressable>
          ) : compactAuth ? (
            <View style={styles.authRow}>
              <Pressable
                onPress={() => router.push('/login')}
                style={styles.iconAuth}
                hitSlop={10}
                accessibilityLabel="Log in">
                <Ionicons name="log-in-outline" size={24} color={FinesseColors.secondary} />
              </Pressable>
              <Pressable
                onPress={() => router.push('/signup')}
                style={styles.signupIconBtn}
                hitSlop={10}
                accessibilityLabel="Sign up">
                <Ionicons name="person-add-outline" size={22} color={FinesseColors.background} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.authRow}>
              <Pressable onPress={() => router.push('/login')} hitSlop={8}>
                <Text style={styles.login}>LOGIN</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/signup')} style={styles.signupBtn}>
                <Text style={styles.signupTxt}>SIGNUP</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.menuCard}>
            <Text style={styles.menuName}>{user?.name}</Text>
            <Text style={styles.menuEmail}>{user?.email}</Text>
            {isOwner() && (
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/dashboard');
                }}>
                <Ionicons name="grid-outline" size={20} color={FinesseColors.secondary} />
                <Text style={styles.menuItemText}>Dashboard</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.menuLogout}
              onPress={async () => {
                setMenuOpen(false);
                await logout();
                router.replace('/');
              }}>
              <Ionicons name="log-out-outline" size={20} color={FinesseColors.background} />
              <Text style={styles.menuLogoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    backgroundColor: FinesseColors.background,
    borderBottomWidth: 1,
    borderBottomColor: FinesseColors.border,
  },
  logoWrap: { paddingVertical: 4, flexShrink: 1 },
  logoText: {
    fontFamily: FinesseFonts.serif,
    fontSize: 28,
    color: FinesseColors.secondary,
    letterSpacing: 1,
  },
  logoTextSmall: { fontSize: 24 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 0 },
  iconBtn: { padding: 8 },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: FinesseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: FinesseColors.secondary,
    fontSize: 10,
    fontFamily: FinesseFonts.sansMedium,
  },
  userBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: 120 },
  userFirst: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: FinesseColors.secondary,
  },
  authRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  login: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.2,
    color: FinesseColors.secondary,
  },
  signupBtn: {
    backgroundColor: FinesseColors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 2,
  },
  signupTxt: {
    color: FinesseColors.background,
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
  },
  iconAuth: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  signupIconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: FinesseColors.secondary,
  },
  modalRoot: { flex: 1 },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  menuCard: {
    position: 'absolute',
    top: 56,
    right: 12,
    backgroundColor: FinesseColors.background,
    borderRadius: 8,
    padding: 20,
    minWidth: 220,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  menuName: {
    fontFamily: FinesseFonts.serif,
    fontSize: 22,
    color: FinesseColors.secondary,
  },
  menuEmail: {
    fontFamily: FinesseFonts.sans,
    fontSize: 13,
    color: FinesseColors.textLight,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: FinesseColors.border,
  },
  menuItemText: {
    fontFamily: FinesseFonts.sansMedium,
    color: FinesseColors.secondary,
  },
  menuLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    backgroundColor: FinesseColors.secondary,
    padding: 12,
    borderRadius: 4,
    justifyContent: 'center',
  },
  menuLogoutText: {
    color: FinesseColors.background,
    fontFamily: FinesseFonts.sansMedium,
  },
});
