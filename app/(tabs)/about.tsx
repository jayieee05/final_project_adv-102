import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/finesse/app-header';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { useMobileContentWidth, useTabScrollPadding } from '@/hooks/use-tab-scroll-padding';

export default function AboutScreen() {
  const scrollBottom = useTabScrollPadding(24);
  const { horizontalPad, isCompact } = useMobileContentWidth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollBottom }]}>
        <View style={[styles.block, { paddingHorizontal: horizontalPad }]}>
          <Text style={styles.label}>Our Journey</Text>
          <Text style={[styles.title, isCompact && styles.titleSmall]}>Our Story</Text>
          <Text style={styles.p}>
            Finesse was brought to life by three passionate minds Rachel Paragas, Michelle Capitan,
            and Jay Marc Torrefranca with a shared vision to create a jewelry brand that blends
            elegance, simplicity, and modern style. What started as a school project turned into a
            meaningful venture, built on creativity, dedication, and teamwork.
          </Text>
          <Text style={styles.p}>
            Each piece in our collection is thoughtfully designed to elevate everyday looks, making
            style more personal and accessible. Finesse represents our journey from ideas and
            sketches to polished designs and our goal to bring beauty and confidence to others
            through our creations.
          </Text>
        </View>

        <View style={[styles.block, { paddingHorizontal: horizontalPad }]}>
          <Text style={styles.label}>Meet the Team</Text>
          <Text style={[styles.title, isCompact && styles.titleSmall]}>Who We Are?</Text>
          <Text style={styles.p}>
            We are Finesse — a jewelry brand founded by Rachel, Michelle, and Jay Marc. Together we
            combine creativity, attention to detail, and a love for timeless design to bring you
            pieces you will treasure.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.background },
  scroll: { flexGrow: 1 },
  block: { paddingVertical: 24 },
  label: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 11,
    letterSpacing: 3,
    color: FinesseColors.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: FinesseFonts.serif,
    fontSize: 34,
    color: FinesseColors.secondary,
    marginBottom: 16,
  },
  titleSmall: { fontSize: 28, lineHeight: 34 },
  p: {
    fontFamily: FinesseFonts.sans,
    fontSize: 16,
    lineHeight: 26,
    color: FinesseColors.text,
    marginBottom: 14,
  },
});
