import type { ImageSource } from 'expo-image';

/** Local jewelry photos (from Desktop/Jewelry), keyed for catalog + cart persistence */
export const PRODUCT_IMAGES = {
  ringOfLeaves: require('@/assets/jewelry/ring-of-leaves.webp'),
  simpleChainRing: require('@/assets/jewelry/simple-chain-ring.webp'),
  tiaraRing: require('@/assets/jewelry/tiara-ring.avif'),
  roseRing: require('@/assets/jewelry/rose-ring.png'),
  signetRing: require('@/assets/jewelry/signet-ring.webp'),
  chainedCuff: require('@/assets/jewelry/chained-cuff.webp'),
  thinChain: require('@/assets/jewelry/thin-chain.jpg'),
  leafyChain: require('@/assets/jewelry/leafy-chain.webp'),
  floraChain: require('@/assets/jewelry/flora-chain.jpg'),
  arrowCuff: require('@/assets/jewelry/arrow-cuff.webp'),
  diamondStuds: require('@/assets/jewelry/diamond-studs.webp'),
  miniHoops: require('@/assets/jewelry/mini-hoops.webp'),
  danglingLeaves: require('@/assets/jewelry/dangling-leaves.webp'),
  leafStuds: require('@/assets/jewelry/leaf-studs.webp'),
  chainDrops: require('@/assets/jewelry/chain-drops.webp'),
  rubyPendant: require('@/assets/jewelry/ruby-pendant.webp'),
  diamondChoker: require('@/assets/jewelry/diamond-choker.webp'),
  heartDrop: require('@/assets/jewelry/heart-drop.webp'),
  leafPendant: require('@/assets/jewelry/leaf-pendant.webp'),
  initialPendant: require('@/assets/jewelry/initial-pendant.webp'),
} as const;

export type ProductImageKey = keyof typeof PRODUCT_IMAGES;

export function productImageSource(key: ProductImageKey): ImageSource {
  return PRODUCT_IMAGES[key];
}

/** Hero / about sections */
export const HERO_LIFESTYLE_BG = require('../assets/finesse/hero-lifestyle-bg.png');
/** "Our Craftsmanship" preview on home */
export const CRAFT_JEWELRY_IMAGE = require('../assets/finesse/craftsmanship-preview.png');
