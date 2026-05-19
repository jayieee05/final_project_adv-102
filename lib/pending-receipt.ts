import type { Transaction } from '@/types/transaction';

let pending: Transaction | null = null;

export function setPendingReceipt(transaction: Transaction): void {
  pending = transaction;
}

export function takePendingReceipt(id: string): Transaction | null {
  if (pending?.id === id) {
    const tx = pending;
    pending = null;
    return tx;
  }
  return null;
}

export function peekPendingReceipt(id: string): Transaction | null {
  return pending?.id === id ? pending : null;
}
