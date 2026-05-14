import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardScreen() {
  const { user, isOwner } = useAuth();

  if (!isOwner()) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backTxt}>← Back</Text>
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.denied}>This area is for store owners only.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backTxt}>← Back</Text>
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.sub}>
          Signed in as {user?.name} ({user?.email}). Use the web admin dashboard for full inventory
          and order tools; this screen confirms owner access in the mobile app.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.background },
  back: { padding: 16 },
  backTxt: { fontFamily: FinesseFonts.sansMedium, color: FinesseColors.primaryDark, fontSize: 16 },
  body: { padding: 24 },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 34,
    color: FinesseColors.secondary,
    marginBottom: 12,
  },
  sub: {
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: FinesseColors.text,
  },
  center: { flex: 1, justifyContent: 'center', padding: 24 },
  denied: {
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    color: FinesseColors.textLight,
    textAlign: 'center',
  },
});
