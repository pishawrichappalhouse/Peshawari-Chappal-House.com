import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
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
  const { isAdmin } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
      setProducts(productList);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Separate effect for seeding products (Admin only)
  useEffect(() => {
    const seedProducts = async () => {
      if (products.length === 0 && !loading && isAdmin) {
        // Seed initial products if collection is empty and user is admin
        for (const p of INITIAL_PRODUCTS) {
          const { id, ...data } = p;
          try {
            await setDoc(doc(db, 'products', id), data);
          } catch (error) {
            console.error("Error seeding product: ", error);
          }
        }
      }
    };
    seedProducts();
  }, [products.length, loading, isAdmin]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await addDoc(collection(db, 'products'), product);
  };

  const updateProduct = async (product: Product) => {
    const { id, ...data } = product;
    await updateDoc(doc(db, 'products', id), data);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
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
