import { storageGetItem, storageSetItem } from '@/lib/storage';
import type { Transaction } from '@/types/transaction';

const KEY_PREFIX = 'finesse_transactions_';

function keyForUser(userId: string): string {
  return `${KEY_PREFIX}${userId}`;
}

export async function saveTransactionLocal(transaction: Transaction): Promise<void> {
  const raw = await storageGetItem(keyForUser(transaction.userId));
  const list: Transaction[] = raw ? (JSON.parse(raw) as Transaction[]) : [];
  const idx = list.findIndex((t) => t.id === transaction.id);
  if (idx >= 0) {
    list[idx] = transaction;
  } else {
    list.unshift(transaction);
  }
  await storageSetItem(keyForUser(transaction.userId), JSON.stringify(list));
}

export async function getTransactionLocal(
  userId: string,
  transactionId: string,
): Promise<Transaction | null> {
  const raw = await storageGetItem(keyForUser(userId));
  if (!raw) return null;
  try {
    const list = JSON.parse(raw) as Transaction[];
    return list.find((t) => t.id === transactionId) ?? null;
  } catch {
    return null;
  }
}

export async function listTransactionsLocal(userId: string): Promise<Transaction[]> {
  const raw = await storageGetItem(keyForUser(userId));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Transaction[];
  } catch {
    return [];
  }
}

export async function deleteTransactionLocal(
  userId: string,
  transactionId: string,
): Promise<void> {
  const raw = await storageGetItem(keyForUser(userId));
  if (!raw) return;
  try {
    const list = JSON.parse(raw) as Transaction[];
    const next = list.filter((t) => t.id !== transactionId);
    await storageSetItem(keyForUser(userId), JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
