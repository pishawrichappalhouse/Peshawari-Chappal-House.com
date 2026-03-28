import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Black Peshawari',
    price: 4500,
    image: '/api/attachments/1742381294827_chappal.jpg',
    description: 'Authentic handmade black leather chappal with traditional stitching and durable sole.',
    category: 'Classic'
  },
  {
    id: '2',
    name: 'Premium Midnight Edition',
    price: 5500,
    image: '/api/attachments/1742381294827_chappal.jpg',
    description: 'Premium black leather with double sole for extra comfort and royal look.',
    category: 'Premium'
  },
  {
    id: '3',
    name: 'Modern Black Chappal',
    price: 6000,
    image: '/api/attachments/1742381294827_chappal.jpg',
    description: 'Sleek black leather with modern finish and rugged sole.',
    category: 'Modern'
  },
  {
    id: '4',
    name: 'Traditional Peshawari Special',
    price: 1800,
    image: '/api/attachments/1742381294827_chappal.jpg',
    description: 'Special edition traditional Peshawari chappal with durable sole.',
    category: 'Classic'
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS));
    }
    setLoading(false);
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const updateProduct = async (product: Product) => {
    const updatedProducts = products.map(p => p.id === product.id ? product : p);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = async (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
