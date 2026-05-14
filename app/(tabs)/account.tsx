import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/finesse/app-header';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useMobileContentWidth, useTabScrollPadding } from '@/hooks/use-tab-scroll-padding';

export default function AccountScreen() {
  const { user, logout, isAuthenticated, isOwner } = useAuth();
  const { getTotalItems } = useCart();
  const scrollPad = useTabScrollPadding(32);
  const { horizontalPad } = useMobileContentWidth();

  if (!isAuthenticated()) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AppHeader />
        <View style={[styles.center, { paddingHorizontal: horizontalPad, paddingBottom: scrollPad }]}>
          <Text style={styles.title}>Your account</Text>
          <Text style={styles.sub}>Sign in to save your cart and checkout faster.</Text>
          <Pressable style={styles.primary} onPress={() => router.push('/login')}>
            <Text style={styles.primaryTxt}>LOGIN</Text>
          </Pressable>
          <Pressable style={styles.outline} onPress={() => router.push('/signup')}>
            <Text style={styles.outlineTxt}>CREATE ACCOUNT</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <View style={[styles.card, { marginHorizontal: horizontalPad, marginBottom: scrollPad }]}>
        <Text style={styles.welcome}>Hello, {user?.name?.split(' ')[0]}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.meta}>Items in cart: {getTotalItems()}</Text>
        {isOwner() && (
          <Pressable style={styles.secondary} onPress={() => router.push('/dashboard')}>
            <Text style={styles.secondaryTxt}>Owner dashboard</Text>
          </Pressable>
        )}
        <Pressable style={styles.primary} onPress={() => router.push('/cart')}>
          <Text style={styles.primaryTxt}>VIEW CART</Text>
        </Pressable>
        <Pressable
          style={styles.logout}
          onPress={async () => {
            await logout();
            router.replace('/');
          }}>
          <Text style={styles.logoutTxt}>Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.backgroundAlt },
  center: { flex: 1, padding: 28, justifyContent: 'center' },
  card: { marginTop: 20, padding: 24, backgroundColor: FinesseColors.background, borderRadius: 8, borderWidth: 1, borderColor: FinesseColors.border },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 32,
    color: FinesseColors.secondary,
    marginBottom: 10,
  },
  sub: {
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    color: FinesseColors.textLight,
    marginBottom: 28,
    lineHeight: 24,
  },
  welcome: {
    fontFamily: FinesseFonts.serif,
    fontSize: 28,
    color: FinesseColors.secondary,
    marginBottom: 6,
  },
  email: {
    fontFamily: FinesseFonts.sans,
    fontSize: 15,
    color: FinesseColors.textLight,
    marginBottom: 16,
  },
  meta: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: FinesseColors.text,
    marginBottom: 20,
  },
  primary: {
    backgroundColor: FinesseColors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 12,
  },
  primaryTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 1.5,
    color: FinesseColors.secondary,
  },
  outline: {
    borderWidth: 2,
    borderColor: FinesseColors.secondary,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 2,
  },
  outlineTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 1.2,
    color: FinesseColors.secondary,
  },
  secondary: {
    borderWidth: 1,
    borderColor: FinesseColors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 12,
  },
  secondaryTxt: {
    fontFamily: FinesseFonts.sansMedium,
    color: FinesseColors.primaryDark,
  },
  logout: { marginTop: 16, alignItems: 'center', padding: 12 },
  logoutTxt: {
    fontFamily: FinesseFonts.sansMedium,
    color: FinesseColors.textLight,
    textDecorationLine: 'underline',
  },
});
