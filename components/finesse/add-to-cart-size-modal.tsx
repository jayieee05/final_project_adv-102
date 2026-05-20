import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProductSizePicker } from '@/components/finesse/product-size-picker';
import { ScalePressable } from '@/components/ui/motion';
import { FinesseColors, FinesseFonts } from '@/constants/finesse-theme';
import { productImage, type CatalogProduct } from '@/data/catalog';
import { getSizeOptionsForProduct, isValidSizeForProduct } from '@/data/product-sizes';

type AddToCartSizeModalProps = {
  visible: boolean;
  product: CatalogProduct | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (size: string) => void;
};

export function AddToCartSizeModal({
  visible,
  product,
  loading = false,
  onClose,
  onConfirm,
}: AddToCartSizeModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!product || !visible) return;
    const sizes = getSizeOptionsForProduct(product);
    setSelectedSize(sizes.length === 1 ? sizes[0] : null);
    setShowError(false);
  }, [product?.id, visible]);

  if (!product) return null;

  const confirm = () => {
    if (!isValidSizeForProduct(product, selectedSize)) {
      setShowError(true);
      return;
    }
    onConfirm(selectedSize!);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={loading ? undefined : onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <Pressable style={styles.close} onPress={onClose} hitSlop={10} disabled={loading}>
            <Ionicons name="close" size={22} color={FinesseColors.secondary} />
          </Pressable>
          <View style={styles.productRow}>
            <Image source={productImage(product)} style={styles.thumb} contentFit="cover" />
            <View style={styles.productMeta}>
              <Text style={styles.name} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.price}>{product.price}</Text>
            </View>
          </View>
          <ProductSizePicker
            product={product}
            selectedSize={selectedSize}
            onSelect={(size) => {
              setSelectedSize(size);
              setShowError(false);
            }}
            showError={showError}
          />
          <ScalePressable
            style={[styles.cta, loading && { opacity: 0.75 }]}
            onPress={confirm}
            disabled={loading}
            haptic={!loading}>
            {loading ? (
              <ActivityIndicator color={FinesseColors.secondary} />
            ) : (
              <Text style={styles.ctaTxt}>ADD TO CART</Text>
            )}
          </ScalePressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 20, 16, 0.55)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: FinesseColors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 28,
  },
  close: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: FinesseColors.backgroundAlt,
  },
  productMeta: { flex: 1, justifyContent: 'center' },
  name: {
    fontFamily: FinesseFonts.serif,
    fontSize: 20,
    color: FinesseColors.secondary,
    marginBottom: 4,
  },
  price: {
    fontFamily: FinesseFonts.sansMedium,
    fontSize: 16,
    color: FinesseColors.primaryDark,
  },
  cta: {
    backgroundColor: FinesseColors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 2,
    marginTop: 4,
  },
  ctaTxt: {
    fontFamily: FinesseFonts.sansMedium,
    letterSpacing: 2,
    color: FinesseColors.secondary,
  },
});
