import type { OrderStatus } from '@/types/transaction';

export function orderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'completed':
      return 'Completed';
    case 'returned':
      return 'Returned';
  }
}

export function orderStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return '#b8942f';
    case 'completed':
      return '#5a7a52';
    case 'returned':
      return '#8b4a4a';
  }
}

export const ORDER_STATUS_FILTERS: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'returned', label: 'Returned' },
];
