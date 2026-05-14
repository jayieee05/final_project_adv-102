import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Extra space above the tab bar so scroll content is not hidden (mobile). */
export function useTabScrollPadding(extra = 16) {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  return tabBarHeight + Math.max(insets.bottom, 6) + extra;
}

export function useMobileContentWidth() {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const isNarrow = width < 360;
  const horizontalPad = isCompact ? 14 : 16;
  return { width, isCompact, isNarrow, horizontalPad };
}
