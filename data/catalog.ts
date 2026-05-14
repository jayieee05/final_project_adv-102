/** Product catalog aligned with finessefinalproject-adv101 ShopContent + Bestsellers */

const IMG = {
  r1: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=85',
  r2: 'https://images.unsplash.com/photo-1617038260897-41a1f644bcf9?w=800&q=85',
  n1: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd25?w=800&q=85',
  e1: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=85',
  b1: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220c?w=800&q=85',
  mix: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85',
};

export type ProductCategory = 'rings' | 'necklaces' | 'earrings' | 'bracelets';

export type CatalogProduct = {
  id: number;
  name: string;
  image: string;
  price: string;
  priceValue: number;
  category: ProductCategory;
};

const products: CatalogProduct[] = [
  { id: 1, name: 'Ring Of Leaves', image: IMG.r1, price: '₱11,333', priceValue: 11333, category: 'rings' },
  { id: 2, name: 'Simple Chain Ring', image: IMG.r2, price: '₱5,666', priceValue: 5666, category: 'rings' },
  { id: 3, name: 'Tiara Ring', image: IMG.mix, price: '₱8,500', priceValue: 8500, category: 'rings' },
  { id: 4, name: 'Rose Ring', image: IMG.r1, price: '₱5,666', priceValue: 5666, category: 'rings' },
  { id: 5, name: 'Signet Ring', image: IMG.r2, price: '₱5,666', priceValue: 5666, category: 'rings' },
  { id: 6, name: 'Chained Cuff', image: IMG.b1, price: '₱11,333', priceValue: 11333, category: 'bracelets' },
  { id: 7, name: 'Thin Chain', image: IMG.b1, price: '₱5,100', priceValue: 5100, category: 'bracelets' },
  { id: 8, name: 'Leafy Chain', image: IMG.mix, price: '₱5,100', priceValue: 5100, category: 'bracelets' },
  { id: 9, name: 'Flora Chain', image: IMG.b1, price: '₱2,266', priceValue: 2266, category: 'bracelets' },
  { id: 10, name: 'Arrow Cuff', image: IMG.r2, price: '₱2,833', priceValue: 2833, category: 'bracelets' },
  { id: 11, name: 'Diamond Studs', image: IMG.e1, price: '₱11,333', priceValue: 11333, category: 'earrings' },
  { id: 12, name: 'Mini Hoops', image: IMG.e1, price: '₱5,100', priceValue: 5100, category: 'earrings' },
  { id: 13, name: 'Dangling Leaves', image: IMG.n1, price: '₱3,400', priceValue: 3400, category: 'earrings' },
  { id: 14, name: 'Leaf Studs', image: IMG.e1, price: '₱2,266', priceValue: 2266, category: 'earrings' },
  { id: 15, name: 'Chain Drops', image: IMG.e1, price: '₱2,266', priceValue: 2266, category: 'earrings' },
  { id: 16, name: 'Ruby Pendant', image: IMG.n1, price: '₱14,166', priceValue: 14166, category: 'necklaces' },
  { id: 17, name: 'Diamond Choker', image: IMG.n1, price: '₱17,000', priceValue: 17000, category: 'necklaces' },
  { id: 18, name: 'Heart Drop', image: IMG.n1, price: '₱11,333', priceValue: 11333, category: 'necklaces' },
  { id: 19, name: 'Leaf Pendant', image: IMG.n1, price: '₱5,100', priceValue: 5100, category: 'necklaces' },
  { id: 20, name: 'Initial Pendant', image: IMG.mix, price: '₱5,666', priceValue: 5666, category: 'necklaces' },
];

export const CATEGORIES: { name: string; slug: ProductCategory; image: string }[] = [
  { name: 'Rings', slug: 'rings', image: IMG.r1 },
  { name: 'Necklaces', slug: 'necklaces', image: IMG.n1 },
  { name: 'Earrings', slug: 'earrings', image: IMG.e1 },
  { name: 'Bracelets', slug: 'bracelets', image: IMG.b1 },
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
