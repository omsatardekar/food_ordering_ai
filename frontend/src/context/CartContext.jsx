import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1, instructions = '') => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((i) => i.id === item.id && i.instructions === instructions);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        // No toast for update — toast is already shown in ProductDetail
        return newCart;
      }
      // No toast here — toast is shown in ProductDetail
      return [...prevCart, { ...item, quantity, instructions }];
    });
  };

  const removeFromCart = (itemId, instructions) => {
    setCart((prevCart) => prevCart.filter((i) => !(i.id === itemId && i.instructions === instructions)));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, instructions, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(itemId, instructions);
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.id === itemId && i.instructions === instructions ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
