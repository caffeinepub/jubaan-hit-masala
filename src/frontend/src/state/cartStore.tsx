import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '../backend';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: bigint) => void;
  updateQuantity: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert productId back to BigInt
        return parsed.map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            productId: BigInt(item.product.productId),
            categoryId: BigInt(item.product.categoryId),
            price: BigInt(item.product.price),
          },
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Convert BigInt to string for storage
    const serializable = items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        productId: item.product.productId.toString(),
        categoryId: item.product.categoryId.toString(),
        price: item.product.price.toString(),
      },
    }));
    localStorage.setItem('cart', JSON.stringify(serializable));
  }, [items]);

  const addItem = (product: Product, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: bigint) => {
    setItems((prev) => prev.filter((item) => item.product.productId !== productId));
  };

  const updateQuantity = (productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity / 100, 0);
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
