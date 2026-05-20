import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FadeInView } from '@/components/ui/motion';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import {
  getAverageRating,
  getReviewsForProduct,
  type ProductReview,
} from '@/data/product-reviews';

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={rating >= n ? 'star' : rating >= n - 0.5 ? 'star-half' : 'star-outline'}
          size={size}
          color={FinesseColors.primaryDark}
        />
      ))}
    </View>
  );
}

function ReviewCard({ review, index }: { review: ProductReview; index: number }) {
  return (
    <FadeInView index={index} style={styles.reviewCard}>
      <View style={styles.reviewTop}>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
        <StarRow rating={review.rating} size={12} />
      </View>
      <Text style={styles.reviewTitle}>{review.title}</Text>
      <Text style={styles.reviewBody}>{review.body}</Text>
    </FadeInView>
  );
}

type ProductReviewsSectionProps = {
  productId: number;
};

export function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const reviews = getReviewsForProduct(productId);
  const average = getAverageRating(reviews);

  return (
    <FadeInView index={0} style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Customer reviews</Text>
        <View style={styles.summary}>
          <StarRow rating={average} size={16} />
          <Text style={styles.summaryTxt}>
            {average.toFixed(1)} · {reviews.length} reviews
          </Text>
        </View>
      </View>
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index + 1} />
      ))}
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  sectionHead: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FinesseFonts.serif,
    fontSize: 26,
    color: FinesseColors.secondary,
    marginBottom: 10,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryTxt: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    color: FinesseColors.textLight,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCard: {
    backgroundColor: FinesseColors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: FinesseColors.border,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  reviewMeta: { flex: 1 },
  reviewAuthor: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: FinesseColors.secondary,
  },
  reviewDate: {
    fontFamily: FinesseFonts.sans,
    fontSize: 12,
    color: FinesseColors.textLight,
    marginTop: 2,
  },
  reviewTitle: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 15,
    color: FinesseColors.secondary,
    marginBottom: 6,
  },
  reviewBody: {
    fontFamily: FinesseFonts.sans,
    fontSize: 14,
    lineHeight: 22,
    color: FinesseColors.text,
  },
});
