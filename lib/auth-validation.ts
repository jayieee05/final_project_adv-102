export const MIN_PASSWORD_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validateLoginInput(email: string, password: string): string | null {
  if (!email.trim() || !password) {
    return 'Please fill in all fields';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}

export type SignupFields = {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  country?: string;
  address?: string;
};

export function validateSignupInput(input: SignupFields): string | null {
  const { name, email, password, phone, city } = input;
  if (!name.trim() || !email.trim() || !password || !phone.trim() || !city.trim()) {
    return 'Please fill in all required fields';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return 'Enter a valid phone number (at least 10 digits)';
  }
  return null;
}
