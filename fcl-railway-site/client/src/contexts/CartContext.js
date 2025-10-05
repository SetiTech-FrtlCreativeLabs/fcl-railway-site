import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    saveCartToStorage();
  }, [cartItems]);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const saveCartToStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.sku === product.sku);
      
      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.sku === product.sku
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`${product.title} added to cart!`);
        return updatedItems;
      } else {
        const newItem = {
          sku: product.sku,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || '/placeholder-product.jpg',
          quantity
        };
        toast.success(`${product.title} added to cart!`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (sku) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.sku === sku);
      if (item) {
        toast.success(`${item.title} removed from cart`);
      }
      return prevItems.filter(item => item.sku !== sku);
    });
  };

  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.sku === sku ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItem = (sku) => {
    return cartItems.find(item => item.sku === sku);
  };

  const isInCart = (sku) => {
    return cartItems.some(item => item.sku === sku);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItem,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
