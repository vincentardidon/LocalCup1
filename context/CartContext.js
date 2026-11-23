import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readStoredJson, STORAGE_KEYS, writeStoredJson } from "../utils/storage";

const CartContext = createContext({
  cart: [],
  isLoadingCart: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  cartTotal: 0,
  cartCount: 0,
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  // Lifecycle: Hydrate initial cart from storage on startup
  useEffect(() => {
    let isMounted = true;

    async function loadCartData() {
      try {
        const saved = await readStoredJson(STORAGE_KEYS.CART, []);
        if (isMounted && Array.isArray(saved)) {
          setCart(saved);
        }
      } catch (err) {
        console.error("[CartContext] Failed to load cart:", err);
      } finally {
        if (isMounted) setIsLoadingCart(false);
      }
    }

    loadCartData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Optimistic & instant updates: React state updates immediately, storage writes in background
  const addToCart = async (newItem) => {
    setCart((prev) => {
      const updated = [...prev, newItem];
      writeStoredJson(STORAGE_KEYS.CART, updated).catch((err) =>
        console.error("[CartContext] Background storage write error:", err)
      );
      return updated;
    });
  };

  const removeFromCart = async (cartId) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.cartId !== cartId);
      writeStoredJson(STORAGE_KEYS.CART, updated).catch((err) =>
        console.error("[CartContext] Background storage write error:", err)
      );
      return updated;
    });
  };

  const clearCart = async () => {
    setCart([]);
    writeStoredJson(STORAGE_KEYS.CART, []).catch((err) =>
      console.error("[CartContext] Background storage clear error:", err)
    );
  };

  // Derived state: Cart total & item count
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const priceNum = Number(String(item.price).replace(/[^0-9.]/g, ""));
      return sum + (isNaN(priceNum) ? 0 : priceNum);
    }, 0);
  }, [cart]);

  const cartCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoadingCart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
