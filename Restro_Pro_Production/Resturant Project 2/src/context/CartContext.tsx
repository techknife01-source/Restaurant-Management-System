import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, OrderType } from '../types/restaurant';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    spiceLevel?: string,
    addOns?: { label: string; price: number }[],
    specialInstructions?: string
  ) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  customerNotes: string;
  setCustomerNotes: (notes: string) => void;
  couponCode: string;
  appliedDiscount: number;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  tipPercentage: number;
  setTipPercentage: (tip: number) => void;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  tipAmount: number;
  totalAmount: number;
  totalItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'saffron_thyme_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState<string>('Table 4 (Main Hall)');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Suite 402, 12 Garden View Mews');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [tipPercentage, setTipPercentage] = useState<number>(10);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    spiceLevel?: string,
    addOns: { label: string; price: number }[] = [],
    specialInstructions = ''
  ) => {
    const addOnTotal = addOns.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = item.price + addOnTotal;
    
    // Unique ID based on options
    const addOnsKey = addOns.map(a => a.label).sort().join('|');
    const customKey = `${item.id}-${spiceLevel || 'std'}-${addOnsKey}-${specialInstructions}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(ci => ci.id === customKey);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      const newItem: CartItem = {
        id: customKey,
        menuItemId: item.id,
        name: item.name,
        price: unitPrice,
        quantity,
        image: item.image,
        spiceLevel,
        selectedAddOns: addOns,
        specialInstructions,
        category: item.category
      };
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setAppliedDiscount(0);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME15' || clean === 'SAFFRON15') {
      setCouponCode(clean);
      setAppliedDiscount(0.15); // 15% off
      setCouponError(null);
      return true;
    } else if (clean === 'BISTRO20' || clean === 'CHEF20') {
      setCouponCode(clean);
      setAppliedDiscount(0.20); // 20% off
      setCouponError(null);
      return true;
    } else {
      setCouponError('Invalid coupon code. Try WELCOME15 or BISTRO20.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
    setCouponError(null);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = Number((taxableSubtotal * 0.05).toFixed(2)); // 5% dining tax
  const serviceCharge = orderType === 'dine_in' ? Number((taxableSubtotal * 0.05).toFixed(2)) : 0;
  const tipAmount = Number((taxableSubtotal * (tipPercentage / 100)).toFixed(2));
  const totalAmount = Number((taxableSubtotal + tax + serviceCharge + tipAmount).toFixed(2));
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        deliveryAddress,
        setDeliveryAddress,
        customerNotes,
        setCustomerNotes,
        couponCode,
        appliedDiscount,
        couponError,
        applyCoupon,
        removeCoupon,
        tipPercentage,
        setTipPercentage,
        subtotal,
        tax,
        serviceCharge,
        tipAmount,
        totalAmount,
        totalItemCount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
