import type { CatalogProduct, ProductCategory } from '@/data/catalog';

export const RING_SIZES = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'] as const;
export const BRACELET_SIZES = ['XS', 'S', 'M', 'L'] as const;
export const NECKLACE_SIZES = ['14"', '16"', '18"', '20"'] as const;
export const EARRING_SIZES = ['Standard'] as const;

const SIZES_BY_CATEGORY: Record<ProductCategory, readonly string[]> = {
  rings: RING_SIZES,
  bracelets: BRACELET_SIZES,
  necklaces: NECKLACE_SIZES,
  earrings: EARRING_SIZES,
};

const SIZE_LABEL_BY_CATEGORY: Record<ProductCategory, string> = {
  rings: 'Ring size',
  bracelets: 'Bracelet size',
  necklaces: 'Chain length',
  earrings: 'Size',
};

export function getSizeOptionsForCategory(category: ProductCategory): string[] {
  return [...SIZES_BY_CATEGORY[category]];
}

export function getSizeOptionsForProduct(product: CatalogProduct): string[] {
  return getSizeOptionsForCategory(product.category);
}

export function getSizeLabelForCategory(category: ProductCategory): string {
  return SIZE_LABEL_BY_CATEGORY[category];
}

export function getSizeLabelForProduct(product: CatalogProduct): string {
  return getSizeLabelForCategory(product.category);
}

/** Every catalog item requires an explicit size before add-to-cart */
export function productRequiresSize(_product: CatalogProduct): boolean {
  return getSizeOptionsForProduct(_product).length > 0;
}

export function isValidSizeForProduct(product: CatalogProduct, size: string | null | undefined): boolean {
  if (!size) return false;
  return getSizeOptionsForProduct(product).includes(size);
}
