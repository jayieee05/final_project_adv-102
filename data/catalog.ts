/** Product catalog aligned with finessefinalproject-adv101 ShopContent + Bestsellers */

import type { ImageSource } from 'expo-image';

import {
  PRODUCT_IMAGES,
  type ProductImageKey,
  productImageSource,
} from '@/data/product-images';

export type ProductCategory = 'rings' | 'necklaces' | 'earrings' | 'bracelets';

export type CatalogProduct = {
  id: number;
  name: string;
  imageKey: ProductImageKey;
  price: string;
  priceValue: number;
  category: ProductCategory;
};

export function productImage(product: CatalogProduct | number): ImageSource {
  const p = typeof product === 'number' ? getProductById(product) : product;
  return p ? productImageSource(p.imageKey) : PRODUCT_IMAGES.ringOfLeaves;
}

const products: CatalogProduct[] = [
  { id: 1, name: 'Ring Of Leaves', imageKey: 'ringOfLeaves', price: '₱11,333', priceValue: 11333, category: 'rings' },
  { id: 2, name: 'Simple Chain Ring', imageKey: 'simpleChainRing', price: '₱5,666', priceValue: 5666, category: 'rings' },
  { id: 3, name: 'Tiara Ring', imageKey: 'tiaraRing', price: '₱8,500', priceValue: 8500, category: 'rings' },
  { id: 4, name: 'Rose Ring', imageKey: 'roseRing', price: '₱5,666', priceValue: 5666, category: 'rings' },
  { id: 5, name: 'Signet Ring', imageKey: 'signetRing', price: '₱5,666', priceValue: 5666, category: 'rings' },
  { id: 6, name: 'Chained Cuff', imageKey: 'chainedCuff', price: '₱11,333', priceValue: 11333, category: 'bracelets' },
  { id: 7, name: 'Thin Chain', imageKey: 'thinChain', price: '₱5,100', priceValue: 5100, category: 'bracelets' },
  { id: 8, name: 'Leafy Chain', imageKey: 'leafyChain', price: '₱5,100', priceValue: 5100, category: 'bracelets' },
  { id: 9, name: 'Flora Chain', imageKey: 'floraChain', price: '₱2,266', priceValue: 2266, category: 'bracelets' },
  { id: 10, name: 'Arrow Cuff', imageKey: 'arrowCuff', price: '₱2,833', priceValue: 2833, category: 'bracelets' },
  { id: 11, name: 'Diamond Studs', imageKey: 'diamondStuds', price: '₱11,333', priceValue: 11333, category: 'earrings' },
  { id: 12, name: 'Mini Hoops', imageKey: 'miniHoops', price: '₱5,100', priceValue: 5100, category: 'earrings' },
  { id: 13, name: 'Dangling Leaves', imageKey: 'danglingLeaves', price: '₱3,400', priceValue: 3400, category: 'earrings' },
  { id: 14, name: 'Leaf Studs', imageKey: 'leafStuds', price: '₱2,266', priceValue: 2266, category: 'earrings' },
  { id: 15, name: 'Chain Drops', imageKey: 'chainDrops', price: '₱2,266', priceValue: 2266, category: 'earrings' },
  { id: 16, name: 'Ruby Pendant', imageKey: 'rubyPendant', price: '₱14,166', priceValue: 14166, category: 'necklaces' },
  { id: 17, name: 'Diamond Choker', imageKey: 'diamondChoker', price: '₱17,000', priceValue: 17000, category: 'necklaces' },
  { id: 18, name: 'Heart Drop', imageKey: 'heartDrop', price: '₱11,333', priceValue: 11333, category: 'necklaces' },
  { id: 19, name: 'Leaf Pendant', imageKey: 'leafPendant', price: '₱5,100', priceValue: 5100, category: 'necklaces' },
  { id: 20, name: 'Initial Pendant', imageKey: 'initialPendant', price: '₱5,666', priceValue: 5666, category: 'necklaces' },
];

export const CATEGORIES: { name: string; slug: ProductCategory; imageKey: ProductImageKey }[] = [
  { name: 'Rings', slug: 'rings', imageKey: 'ringOfLeaves' },
  { name: 'Necklaces', slug: 'necklaces', imageKey: 'rubyPendant' },
  { name: 'Earrings', slug: 'earrings', imageKey: 'diamondStuds' },
  { name: 'Bracelets', slug: 'bracelets', imageKey: 'chainedCuff' },
];

export const BESTSELLER_IDS = [1, 16, 6, 11] as const;

export function getProductById(id: number): CatalogProduct | undefined {
  return products.find((p) => p.id === id);
}

export function getAllProducts(): CatalogProduct[] {
  return products;
}

export function getBestsellers(): CatalogProduct[] {
  return BESTSELLER_IDS.map((bid) => products.find((p) => p.id === bid)!).filter(Boolean);
}
