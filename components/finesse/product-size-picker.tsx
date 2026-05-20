import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import type { CatalogProduct } from '@/data/catalog';
import {
  getSizeLabelForProduct,
  getSizeOptionsForProduct,
} from '@/data/product-sizes';

type ProductSizePickerProps = {
  product: CatalogProduct;
  selectedSize: string | null;
  onSelect: (size: string) => void;
  showError?: boolean;
};

export function ProductSizePicker({
  product,
  selectedSize,
  onSelect,
  showError = false,
}: ProductSizePickerProps) {
  const sizes = getSizeOptionsForProduct(product);
  const label = getSizeLabelForProduct(product);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {sizes.map((size) => {
          const active = selectedSize === size;
          return (
            <Pressable
              key={size}
              onPress={() => onSelect(size)}
              style={[styles.chip, active && styles.chipActive, showError && !selectedSize && styles.chipError]}>
              <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{size}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {showError && !selectedSize ? (
        <Text style={styles.errorTxt}>Please select a {label.toLowerCase()} before adding to cart.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  label: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: FinesseColors.secondary,
    marginBottom: 10,
  },
  required: {
    color: '#8b4a4a',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    minWidth: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: FinesseColors.border,
    backgroundColor: FinesseColors.backgroundAlt,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: FinesseColors.primaryDark,
    backgroundColor: FinesseColors.primary,
  },
  chipError: {
    borderColor: '#c47a7a',
  },
  chipTxt: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 14,
    color: FinesseColors.text,
  },
  chipTxtActive: {
    color: FinesseColors.secondary,
  },
  errorTxt: {
    fontFamily: FinesseFonts.sans,
    fontSize: 13,
    color: '#8b4a4a',
    marginTop: 8,
  },
});
