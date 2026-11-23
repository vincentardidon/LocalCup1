import React from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { FavoritesProvider } from "./FavoritesContext";
import { OrderProvider } from "./OrderContext";

/**
 * Root AppProviders composing all global state providers.
 */
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <OrderProvider>{children}</OrderProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
