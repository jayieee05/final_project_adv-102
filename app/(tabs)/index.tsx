import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInView } from '@/components/ui/motion';
import { AboutPreviewSection } from '@/components/finesse/about-preview-section';
import { AppHeader } from '@/components/finesse/app-header';
import { BestsellersSection } from '@/components/finesse/bestsellers-section';
import { FeaturedCategoriesSection } from '@/components/finesse/featured-categories';
import { HomeHero } from '@/components/finesse/home-hero';
import { FinesseColors } from '@/constants/finesse-theme';
import { useTabScrollPadding } from '@/hooks/use-tab-scroll-padding';

export default function HomeScreen() {
  const scrollBottom = useTabScrollPadding(20);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scroll, { paddingBottom: scrollBottom }]}>
        <FadeInView index={0}>
          <HomeHero />
        </FadeInView>
        <FadeInView index={1}>
          <FeaturedCategoriesSection />
        </FadeInView>
        <FadeInView index={2}>
          <BestsellersSection />
        </FadeInView>
        <FadeInView index={3}>
          <AboutPreviewSection />
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: FinesseColors.background },
  scroll: { flexGrow: 1 },
});
