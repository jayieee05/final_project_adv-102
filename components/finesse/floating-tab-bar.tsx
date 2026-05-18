import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/auth-context';

/** Matches shop screen float bar spacing */
export const FLOATING_TAB_BOTTOM_OFFSET = 14;
export const FLOATING_TAB_SCROLL_BASE = 88;

const T = {
  ink: '#2c241c',
  inkSoft: '#5c5046',
  line: 'rgba(44, 36, 28, 0.08)',
  gold: '#b8942f',
};

const floatShadow = Platform.select({
  ios: {
    shadowColor: '#1a1410',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  android: { elevation: 10 },
  default: {},
});

type TabRoute = 'index' | 'shop' | 'account';

const TABS: {
  route: TabRoute;
  label: string;
  inactive: keyof typeof Ionicons.glyphMap;
  active: keyof typeof Ionicons.glyphMap;
}[] = [
  { route: 'index', label: 'Home', inactive: 'home-outline', active: 'home' },
  { route: 'shop', label: 'Shop', inactive: 'bag-outline', active: 'bag-handle' },
  { route: 'account', label: 'Account', inactive: 'person-outline', active: 'person' },
];

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const focusedRoute = state.routes[state.index]?.name;

  const onTabPress = (routeName: TabRoute, routeKey: string, isFocused: boolean) => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.outer, { bottom: FLOATING_TAB_BOTTOM_OFFSET + insets.bottom }]}>
      <View style={[styles.floatBar, floatShadow]}>
        {TABS.map((tab) => {
          const route = state.routes.find((r) => r.name === tab.route);
          if (!route) return null;

          const isFocused = focusedRoute === tab.route;
          const showBadge = tab.route === 'account' && !isAuthenticated();

          return (
            <Pressable
              key={tab.route}
              style={styles.floatHit}
              onPress={() => onTabPress(tab.route, route.key, isFocused)}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={isFocused ? { selected: true } : {}}>
              {isFocused ? (
                <View style={styles.floatCenter}>
                  <Ionicons name={tab.active} size={24} color={T.ink} />
                  <View style={styles.floatGoldBar} />
                </View>
              ) : (
                <View style={styles.iconSlot}>
                  <Ionicons name={tab.inactive} size={24} color={T.inkSoft} />
                  {showBadge ? <View style={styles.badge} /> : null}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatBar: {
    alignSelf: 'stretch',
    marginHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: T.line,
  },
  floatHit: {
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  floatCenter: { alignItems: 'center' },
  floatGoldBar: {
    marginTop: 4,
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: T.gold,
  },
  iconSlot: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e53935',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});
