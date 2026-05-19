import type { CardPaymentInput, GcashPaymentInput, PaymentMethod } from '@/types/transaction';

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function validateCardPayment(input: CardPaymentInput): string | null {
  const name = input.cardholderName.trim();
  if (!name) return 'Enter the name on the card';

  const number = digitsOnly(input.cardNumber);
  if (number.length < 13 || number.length > 19) {
    return 'Enter a valid card number';
  }

  const expiry = input.expiry.trim();
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return 'Expiry must be MM/YY';
  }
  const [mm, yy] = expiry.split('/').map(Number);
  if (mm < 1 || mm > 12) return 'Invalid expiry month';

  const now = new Date();
  const expYear = 2000 + yy;
  const expDate = new Date(expYear, mm, 0);
  if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
    return 'Card has expired';
  }

  const cvv = digitsOnly(input.cvv);
  if (cvv.length < 3 || cvv.length > 4) return 'Enter a valid CVV';

  return null;
}

export function validateGcashPayment(input: GcashPaymentInput): string | null {
  const digits = digitsOnly(input.gcashNumber);
  if (digits.length < 10 || digits.length > 11) {
    return 'Enter a valid GCash mobile number';
  }
  return null;
}

export function validatePaymentMethod(
  method: PaymentMethod,
  card?: CardPaymentInput,
  gcash?: GcashPaymentInput,
): string | null {
  if (method === 'card' && card) return validateCardPayment(card);
  if (method === 'gcash' && gcash) return validateGcashPayment(gcash);
  return null;
}

export function maskCardLast4(cardNumber: string): string {
  const digits = digitsOnly(cardNumber);
  return digits.slice(-4);
}
