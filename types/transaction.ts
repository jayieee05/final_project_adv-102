import type { CartLine } from '@/contexts/cart-context';

export type PaymentMethod = 'card' | 'gcash' | 'cod';

export type TransactionStatus = 'paid' | 'pending' | 'failed';

/** Fulfillment status managed by store admin */
export type OrderStatus = 'pending' | 'completed' | 'returned';

export type Transaction = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: TransactionStatus;
  orderStatus: OrderStatus;
  cardLast4?: string;
  shippingPhone?: string;
  shippingCity?: string;
  shippingAddress?: string;
  createdAt: string;
};

export type CardPaymentInput = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export type GcashPaymentInput = {
  gcashNumber: string;
};
