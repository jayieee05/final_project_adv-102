import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

import type { CartLine } from '@/contexts/cart-context';
import { db } from '@/lib/firebase';
import { maskCardLast4 } from '@/lib/payment-validation';
import {
  getTransactionLocal,
  listTransactionsLocal,
  saveTransactionLocal,
} from '@/lib/transaction-storage';
import type { User } from '@/types/user';
import type {
  CardPaymentInput,
  PaymentMethod,
  Transaction,
  TransactionStatus,
} from '@/types/transaction';

const TRANSACTIONS_COLLECTION = 'transactions';

const SHIPPING_FEE = 150;

export function calculateOrderTotals(itemCount: number, subtotal: number) {
  const shipping = itemCount > 0 ? SHIPPING_FEE : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

type CreateTransactionInput = {
  user: User;
  items: CartLine[];
  paymentMethod: PaymentMethod;
  card?: CardPaymentInput;
};

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<{ success: true; transaction: Transaction } | { success: false; error: string }> {
  const { user, items, paymentMethod, card } = input;
  if (!user.id) {
    return { success: false, error: 'You must be signed in to complete payment.' };
  }
  if (items.length === 0) {
    return { success: false, error: 'Your cart is empty.' };
  }

  const subtotal = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const { shipping, total } = calculateOrderTotals(items.length, subtotal);

  const paymentStatus: TransactionStatus =
    paymentMethod === 'cod' ? 'pending' : 'paid';

  const baseTransaction: Transaction = {
    id: `local_${Date.now()}`,
    userId: String(user.id),
    userEmail: user.email,
    userName: user.name,
    items,
    subtotal,
    shipping,
    total,
    paymentMethod,
    paymentStatus,
    ...(paymentMethod === 'card' && card ? { cardLast4: maskCardLast4(card.cardNumber) } : {}),
    shippingPhone: user.phone,
    shippingCity: user.city,
    shippingAddress: user.address,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      userId: baseTransaction.userId,
      userEmail: baseTransaction.userEmail,
      userName: baseTransaction.userName,
      items: baseTransaction.items,
      subtotal: baseTransaction.subtotal,
      shipping: baseTransaction.shipping,
      total: baseTransaction.total,
      paymentMethod: baseTransaction.paymentMethod,
      paymentStatus: baseTransaction.paymentStatus,
      ...(baseTransaction.cardLast4 ? { cardLast4: baseTransaction.cardLast4 } : {}),
      shippingPhone: baseTransaction.shippingPhone ?? null,
      shippingCity: baseTransaction.shippingCity ?? null,
      shippingAddress: baseTransaction.shippingAddress ?? null,
      createdAt: serverTimestamp(),
    });
    baseTransaction.id = docRef.id;
  } catch {
    /* Firestore unavailable — keep local id; receipt still works */
  }

  await saveTransactionLocal(baseTransaction);
  return { success: true, transaction: baseTransaction };
}

function mapTransactionDoc(
  docSnap: { id: string; data: () => Record<string, unknown> },
): Transaction {
  const data = docSnap.data();
  const createdAt =
    data.createdAt &&
    typeof data.createdAt === 'object' &&
    data.createdAt !== null &&
    'toDate' in data.createdAt &&
    typeof (data.createdAt as { toDate: () => Date }).toDate === 'function'
      ? (data.createdAt as { toDate: () => Date }).toDate().toISOString()
      : new Date().toISOString();
  return {
    id: docSnap.id,
    userId: data.userId as string,
    userEmail: data.userEmail as string,
    userName: data.userName as string,
    items: data.items as Transaction['items'],
    subtotal: data.subtotal as number,
    shipping: data.shipping as number,
    total: data.total as number,
    paymentMethod: data.paymentMethod as Transaction['paymentMethod'],
    paymentStatus: data.paymentStatus as Transaction['paymentStatus'],
    cardLast4: data.cardLast4 as string | undefined,
    shippingPhone: data.shippingPhone as string | undefined,
    shippingCity: data.shippingCity as string | undefined,
    shippingAddress: data.shippingAddress as string | undefined,
    createdAt,
  };
}

export async function fetchTransactionById(
  id: string,
  userId?: string,
): Promise<Transaction | null> {
  if (userId) {
    const local = await getTransactionLocal(userId, id);
    if (local) return local;
  }
  if (id.startsWith('local_')) {
    return userId ? getTransactionLocal(userId, id) : null;
  }
  try {
    const snap = await getDoc(doc(db, TRANSACTIONS_COLLECTION, id));
    if (snap.exists()) return mapTransactionDoc(snap);
  } catch {
    /* fall through */
  }
  return userId ? getTransactionLocal(userId, id) : null;
}

export async function fetchUserTransactions(userId: string): Promise<Transaction[]> {
  const merged = new Map<string, Transaction>();

  const localRows = await listTransactionsLocal(userId);
  for (const tx of localRows) merged.set(tx.id, tx);

  try {
    const q = query(collection(db, TRANSACTIONS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      merged.set(docSnap.id, mapTransactionDoc(docSnap));
    }
  } catch {
    /* use local only */
  }

  return [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function paymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'card':
      return 'Credit / debit card';
    case 'gcash':
      return 'GCash';
    case 'cod':
      return 'Cash on delivery';
  }
}
