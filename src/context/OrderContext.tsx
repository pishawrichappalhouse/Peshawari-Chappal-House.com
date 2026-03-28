import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    setLoading(false);
  }, []);

  const addOrder = async (order: Omit<Order, 'id'>) => {
    const newOrder = { ...order, id: 'ORD-' + Date.now().toString().slice(-6) };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = async (orderId: string) => {
    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
