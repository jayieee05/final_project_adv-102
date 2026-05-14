import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useMobileContentWidth } from '@/hooks/use-tab-scroll-padding';

export function FinesseFooter() {
  const [email, setEmail] = useState('');
  const { horizontalPad, isCompact } = useMobileContentWidth();

  const submit = () => {
    if (!email.trim()) return;
    setEmail('');
    Alert.alert('Thank you for subscribing!');
  };

  return (
    <LinearGradient
      colors={[FinesseColors.secondary, FinesseColors.footerGradientEnd]}
      style={[styles.wrap, { paddingBottom: isCompact ? 28 : 36 }]}>
      <View style={[styles.topRule, { marginHorizontal: horizontalPad }]} />
      <View style={[styles.inner, { paddingHorizontal: horizontalPad, gap: isCompact ? 20 : 28 }]}>
        <Text style={[styles.logo, isCompact && styles.logoSmall]}>Finesse</Text>
        <Text style={styles.tagline}>Crafting timeless elegance, one piece at a time.</Text>

        <View style={styles.col}>
          <Text style={styles.colTitle}>Shop</Text>
          {(['Rings', 'Necklaces', 'Earrings', 'Bracelets'] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() =>
                router.push(`/(tabs)/shop?category=${item.toLowerCase()}` as never)
              }>
              <Text style={[styles.link, { paddingVertical: 6 }]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.col}>
          <Text style={styles.colTitle}>Company</Text>
          <Pressable onPress={() => router.push('/(tabs)/about')}>
            <Text style={[styles.link, { paddingVertical: 6 }]}>About Us</Text>
          </Pressable>
        </View>

        <View style={styles.col}>
          <Text style={styles.colTitle}>Stay Updated</Text>
          <Text style={styles.newsDesc}>
            Subscribe to our newsletter for exclusive offers and updates
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Your email address"
            placeholderTextColor="rgba(255,255,255,0.45)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Pressable onPress={submit} style={styles.subscribeBtn}>
            <Text style={styles.subscribeTxt}>Subscribe</Text>
          </Pressable>
        </View>

        <View style={styles.bottom}>
          <View style={styles.socialRow}>
            <Pressable
              style={styles.social}
              onPress={() => Linking.openURL('https://www.instagram.com/the.finesse_mc/')}>
              <Ionicons name="logo-instagram" size={26} color={FinesseColors.white} />
            </Pressable>
            <Pressable
              style={styles.social}
              onPress={() =>
                Linking.openURL('https://www.facebook.com/profile.php?id=100093146019011')
              }>
              <Ionicons name="logo-facebook" size={26} color={FinesseColors.white} />
            </Pressable>
          </View>
          <Text style={styles.copy}>© 2026 Finesse Collection. All rights reserved.</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 8 },
  topRule: {
    height: 2,
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: FinesseColors.primary,
    opacity: 0.85,
  },
  inner: {},
  logo: {
    fontFamily: FinesseFonts.serif,
    fontSize: 36,
    color: FinesseColors.white,
    marginBottom: 12,
  },
  logoSmall: { fontSize: 30 },
  tagline: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.72)',
    maxWidth: 300,
    marginBottom: 8,
  },
  col: { gap: 10 },
  colTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 22,
    color: FinesseColors.white,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: FinesseColors.primary,
    alignSelf: 'flex-start',
    paddingBottom: 6,
  },
  link: {
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    color: FinesseColors.whiteMuted,
    marginBottom: 4,
  },
  newsDesc: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 15,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 22,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: FinesseColors.white,
    fontFamily: FinesseFonts.sans,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  subscribeBtn: {
    backgroundColor: FinesseColors.primary,
    paddingVertical: 14,
    borderRadius: 2,
    alignItems: 'center',
  },
  subscribeTxt: {
    fontFamily: FinesseFonts.sansMedium,
    color: FinesseColors.secondary,
    fontSize: 15,
  },
  bottom: {
    marginTop: 16,
    paddingTop: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    gap: 20,
  },
  socialRow: { flexDirection: 'row', gap: 16 },
  social: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    fontFamily: FinesseFonts.sansLight,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
});
