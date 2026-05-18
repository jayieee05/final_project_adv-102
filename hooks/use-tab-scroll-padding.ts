import { FLOATING_TAB_SCROLL_BASE } from '@/components/finesse/floating-tab-bar';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Extra space above the floating tab bar (same as shop screen). */
export function useTabScrollPadding(extra = 0) {
  const insets = useSafeAreaInsets();
  return FLOATING_TAB_SCROLL_BASE + insets.bottom + extra;
}

export function useMobileContentWidth() {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;
  const isNarrow = width < 360;
  const horizontalPad = isCompact ? 14 : 16;
  return { width, isCompact, isNarrow, horizontalPad };
}
