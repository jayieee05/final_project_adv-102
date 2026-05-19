import type { Transaction } from '@/types/transaction';

export function receiptNumberFromId(id: string): string {
  return `FN-${id.slice(0, 8).toUpperCase()}`;
}

export function formatReceiptDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-PH', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function receiptStatusLabel(tx: Transaction): string {
  if (tx.paymentStatus === 'paid') return 'PAYMENT CONFIRMED';
  if (tx.paymentStatus === 'pending') return 'PAYMENT PENDING';
  return 'PAYMENT FAILED';
}
