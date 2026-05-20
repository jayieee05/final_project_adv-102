/** Curated customer reviews for product detail pages */

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
};

const REVIEW_POOL: Omit<ProductReview, 'id'>[] = [
  {
    author: 'Maria L.',
    rating: 5,
    date: 'Mar 2026',
    title: 'Stunning in person',
    body: 'Even more beautiful than the photos. The finish is flawless and it arrived carefully packaged.',
  },
  {
    author: 'James R.',
    rating: 5,
    date: 'Feb 2026',
    title: 'Perfect gift',
    body: 'Bought this as a gift and she loved it. True Finesse quality — elegant without being flashy.',
  },
  {
    author: 'Ana S.',
    rating: 4,
    date: 'Jan 2026',
    title: 'Lovely craftsmanship',
    body: 'Delicate details and comfortable to wear all day. Sizing was easy to confirm at checkout.',
  },
  {
    author: 'David K.',
    rating: 5,
    date: 'Dec 2025',
    title: 'Worth every peso',
    body: 'You can tell it is handcrafted. Matches the rest of my collection from Finesse perfectly.',
  },
  {
    author: 'Sofia M.',
    rating: 4,
    date: 'Nov 2025',
    title: 'Beautiful everyday piece',
    body: 'Goes with everything. Fast delivery and the receipt made it easy to track my order.',
  },
  {
    author: 'Elena T.',
    rating: 5,
    date: 'Oct 2025',
    title: 'Exceeded expectations',
    body: 'The gold tone is warm and rich. I have received so many compliments already.',
  },
];

/** Stable reviews per product (3–4 items, seeded by product id) */
export function getReviewsForProduct(productId: number): ProductReview[] {
  const count = 3 + (productId % 2);
  const start = productId % REVIEW_POOL.length;
  const picked: ProductReview[] = [];
  for (let i = 0; i < count; i++) {
    const base = REVIEW_POOL[(start + i) % REVIEW_POOL.length];
    picked.push({
      ...base,
      id: `${productId}-review-${i}`,
    });
  }
  return picked;
}

export function getAverageRating(reviews: ProductReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
