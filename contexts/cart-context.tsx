import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { API_URL } from '@/config/api';
import { storageGetItem, storageRemoveItem, storageSetItem } from '@/lib/storage';
import type { CatalogProduct } from '@/data/catalog';

import { useAuth } from './auth-context';

export type CartLine = {
  id: number;
  name: string;
  image: string;
  price: string;
  priceValue: number;
  quantity: number;
  size: string | null;
  material: string;
  category: string;
};

type CartContextValue = {
  cartItems: CartLine[];
  addToCart: (
    product: CatalogProduct,
    options?: { quantity?: number; size?: string | null; material?: string },
  ) => Promise<void>;
  removeFromCart: (itemId: number, size?: string | null, material?: string) => Promise<void>;
  updateQuantity: (itemId: number, newQuantity: number, size?: string | null, material?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY_CART = 'finesse_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, getToken } = useAuth();
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFromStorage = useCallback(async () => {
    const raw = await storageGetItem(KEY_CART);
    if (raw) {
      try {
        setCartItems(JSON.parse(raw) as CartLine[]);
      } catch {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, []);

  const saveLocal = useCallback(async (items: CartLine[]) => {
    await storageSetItem(KEY_CART, JSON.stringify(items));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated() && user) {
          const token = await getToken();
          if (!token) {
            await loadFromStorage();
            return;
          }
          const response = await fetch(`${API_URL}/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const data = (await response.json()) as { success?: boolean; items?: CartLine[] };
            if (cancelled) return;
            if (data.success) {
              setCartItems(data.items ?? []);
              const localCart = await storageGetItem(KEY_CART);
              if (localCart) {
                try {
                  const localItems = JSON.parse(localCart) as CartLine[];
                  if (localItems.length > 0) {
                    for (const item of localItems) {
                      await fetch(`${API_URL}/cart/add`, {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          productId: item.id,
                          quantity: item.quantity || 1,
                          size: item.size ?? null,
                          material: item.material || 'Gold',
                        }),
                      });
                    }
                    const reload = await fetch(`${API_URL}/cart`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    });
                    if (reload.ok) {
                      const reloadData = (await reload.json()) as { success?: boolean; items?: CartLine[] };
                      if (reloadData.success) setCartItems(reloadData.items ?? []);
                    }
                    await storageRemoveItem(KEY_CART);
                  }
                } catch {
                  /* ignore */
                }
              }
              return;
            }
          }
          await loadFromStorage();
        } else {
          await loadFromStorage();
        }
      } catch {
        await loadFromStorage();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isAuthenticated, getToken, loadFromStorage]);

  const addToCart = useCallback(
    async (
      product: CatalogProduct,
      options: { quantity?: number; size?: string | null; material?: string } = {},
    ) => {
      const quantity = options.quantity ?? 1;
      const size = options.size ?? null;
      const material = options.material ?? 'Gold';

      if (isAuthenticated() && user) {
        try {
          const token = await getToken();
          if (token) {
            const response = await fetch(`${API_URL}/cart/add`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productId: product.id,
                quantity,
                size,
                material,
              }),
            });
            if (response.ok) {
              const data = (await response.json()) as { success?: boolean; items?: CartLine[] };
              if (data.success) {
                setCartItems(data.items ?? []);
                return;
              }
            }
          }
        } catch {
          /* fall through to local */
        }
      }

      setCartItems((prev) => {
        const idx = prev.findIndex(
          (item) => item.id === product.id && item.size === size && item.material === material,
        );
        let next: CartLine[];
        if (idx > -1) {
          next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        } else {
          next = [
            ...prev,
            {
              id: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
              priceValue: product.priceValue,
              quantity,
              size,
              material,
              category: product.category,
            },
          ];
        }
        void saveLocal(next);
        return next;
      });
    },
    [isAuthenticated, user, getToken, saveLocal],
  );

  const removeFromCart = useCallback(
    async (itemId: number, size: string | null = null, material = 'Gold') => {
      if (isAuthenticated() && user) {
        try {
          const token = await getToken();
          if (token) {
            const response = await fetch(`${API_URL}/cart/remove`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ productId: itemId, size, material }),
            });
            if (response.ok) {
              const data = (await response.json()) as { success?: boolean; items?: CartLine[] };
              if (data.success) {
                setCartItems(data.items ?? []);
                return;
              }
            }
          }
        } catch {
          /* local fallback */
        }
      }
      setCartItems((prev) => {
        const next = prev.filter(
          (item) => !(item.id === itemId && item.size === size && item.material === material),
        );
        void saveLocal(next);
        return next;
      });
    },
    [isAuthenticated, user, getToken, saveLocal],
  );

  const updateQuantity = useCallback(
    async (itemId: number, newQuantity: number, size: string | null = null, material = 'Gold') => {
      if (newQuantity <= 0) {
        await removeFromCart(itemId, size, material);
        return;
      }
      if (isAuthenticated() && user) {
        try {
          const token = await getToken();
          if (token) {
            const response = await fetch(`${API_URL}/cart/update`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productId: itemId,
                quantity: newQuantity,
                size,
                material,
              }),
            });
            if (response.ok) {
              const data = (await response.json()) as { success?: boolean; items?: CartLine[] };
              if (data.success) {
                setCartItems(data.items ?? []);
                return;
              }
            }
          }
        } catch {
          /* local */
        }
      }
      setCartItems((prev) => {
        const next = prev.map((item) =>
          item.id === itemId && item.size === size && item.material === material
            ? { ...item, quantity: newQuantity }
            : item,
        );
        void saveLocal(next);
        return next;
      });
    },
    [isAuthenticated, user, getToken, saveLocal, removeFromCart],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated() && user) {
      try {
        const token = await getToken();
        if (token) {
          const response = await fetch(`${API_URL}/cart/clear`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            setCartItems([]);
            return;
          }
        }
      } catch {
        /* local */
      }
    }
    setCartItems([]);
    await storageRemoveItem(KEY_CART);
  }, [isAuthenticated, user, getToken]);

  const getTotalItems = useCallback(
    () => cartItems.reduce((t, item) => t + item.quantity, 0),
    [cartItems],
  );

  const getTotalPrice = useCallback(
    () => cartItems.reduce((t, item) => t + item.priceValue * item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isLoading,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isLoading,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
