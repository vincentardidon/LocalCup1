import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { readStoredJson, STORAGE_KEYS, writeStoredJson } from "../utils/storage";

const OrderContext = createContext({
  currentOrder: null,
  orderHistory: [],
  isLoadingOrders: false,
  placeOrder: async () => null,
  refreshOrderStatus: async () => null,
  loadOrders: async () => {},
});

export function OrderProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Lifecycle: Hydrate orders on mount
  useEffect(() => {
    let isMounted = true;

    async function loadSavedOrders() {
      try {
        const activeOrder = await readStoredJson(STORAGE_KEYS.CURRENT_ORDER, null);
        const history = await readStoredJson(STORAGE_KEYS.ORDER_HISTORY, []);
        if (isMounted) {
          if (activeOrder) setCurrentOrder(activeOrder);
          if (Array.isArray(history)) setOrderHistory(history);
        }
      } catch (err) {
        console.error("[OrderContext] Failed to load orders:", err);
      }
    }

    loadSavedOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const placeOrder = async (items, total) => {
    const createdOrder = await api.submitOrder({ items, total });

    setOrderHistory((prev) => {
      const updatedHistory = [createdOrder, ...prev];
      writeStoredJson(STORAGE_KEYS.ORDER_HISTORY, updatedHistory).catch(() => {});
      return updatedHistory;
    });

    setCurrentOrder(createdOrder);
    writeStoredJson(STORAGE_KEYS.CURRENT_ORDER, createdOrder).catch(() => {});

    return createdOrder;
  };

  const refreshOrderStatus = async () => {
    if (!currentOrder?.orderNumber) return null;
    const updated = await api.fetchOrderStatus(currentOrder.orderNumber);
    if (updated) {
      setCurrentOrder({ ...updated });
      setOrderHistory((prev) => {
        const nextHistory = prev.map((o) =>
          o.orderNumber === updated.orderNumber ? { ...updated } : o
        );
        writeStoredJson(STORAGE_KEYS.ORDER_HISTORY, nextHistory).catch(() => {});
        return nextHistory;
      });
    }
    return updated;
  };

  const loadOrders = async () => {
    const activeOrder = await readStoredJson(STORAGE_KEYS.CURRENT_ORDER, null);
    const history = await readStoredJson(STORAGE_KEYS.ORDER_HISTORY, []);
    setCurrentOrder(activeOrder);
    setOrderHistory(history || []);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orderHistory,
        isLoadingOrders,
        placeOrder,
        refreshOrderStatus,
        loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
