export type User = {
  id?: string | number;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  city?: string;
  country?: string;
  address?: string;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  country?: string;
  address?: string;
};
