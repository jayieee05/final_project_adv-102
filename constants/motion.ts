/** Shared Reanimated spring presets for a cohesive, modern feel */
export const MotionSpring = {
  snappy: { damping: 20, stiffness: 280, mass: 0.8 },
  gentle: { damping: 22, stiffness: 180, mass: 1 },
  bouncy: { damping: 14, stiffness: 220, mass: 0.9 },
} as const;

export const MotionDuration = {
  fast: 220,
  normal: 380,
  slow: 520,
} as const;

export const MotionStagger = {
  item: 65,
  section: 120,
} as const;
