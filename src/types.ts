export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface Order {
  id: string;
  userEmail: string;
  customerName: string;
  address: string;
  phone: string;
  size?: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Processing' | 'Confirmed' | 'Cancelled';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  email: string;
  username?: string;
  password?: string;
  role: 'user' | 'admin';
}
