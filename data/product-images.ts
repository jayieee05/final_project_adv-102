import type { ImageSource } from 'expo-image';

/** Local jewelry photos (Finesse Jewelry assets), keyed for catalog + cart persistence */
export const PRODUCT_IMAGES = {
  ringOfLeaves: require('@/assets/jewelry/ring-of-leaves.png'),
  simpleChainRing: require('@/assets/jewelry/simple-chain-ring.png'),
  tiaraRing: require('@/assets/jewelry/tiara-ring.png'),
  roseRing: require('@/assets/jewelry/rose-ring.png'),
  signetRing: require('@/assets/jewelry/signet-ring.png'),
  chainedCuff: require('@/assets/jewelry/chained-cuff.png'),
  thinChain: require('@/assets/jewelry/thin-chain.png'),
  leafyChain: require('@/assets/jewelry/leafy-chain.png'),
  floraChain: require('@/assets/jewelry/flora-chain.png'),
  arrowCuff: require('@/assets/jewelry/arrow-cuff.png'),
  diamondStuds: require('@/assets/jewelry/diamond-studs.png'),
  miniHoops: require('@/assets/jewelry/mini-hoops.png'),
  danglingLeaves: require('@/assets/jewelry/dangling-leaves.png'),
  leafStuds: require('@/assets/jewelry/leaf-studs.png'),
  chainDrops: require('@/assets/jewelry/chain-drops.png'),
  rubyPendant: require('@/assets/jewelry/ruby-pendant.png'),
  diamondChoker: require('@/assets/jewelry/diamond-choker.png'),
  heartDrop: require('@/assets/jewelry/heart-drop.png'),
  leafPendant: require('@/assets/jewelry/leaf-pendant.png'),
  initialPendant: require('@/assets/jewelry/initial-pendant.png'),
} as const;

export type ProductImageKey = keyof typeof PRODUCT_IMAGES;

export function productImageSource(key: ProductImageKey): ImageSource {
  return PRODUCT_IMAGES[key];
}

/** Hero / about sections */
export const HERO_LIFESTYLE_BG = require('../assets/finesse/hero-lifestyle-bg.jpg');
/** "Our Craftsmanship" preview on home */
export const CRAFT_JEWELRY_IMAGE = require('../assets/finesse/craftsmanship-preview.png');
