import { cafes as mockCafes } from "../data/cafes";
import {
  coffeeBased,
  meals,
  nonCoffeeBased,
  pastries,
  soda,
} from "../data/products";
import { readStoredJson, STORAGE_KEYS, writeStoredJson } from "../utils/storage";

const allMockProducts = [
  ...coffeeBased,
  ...nonCoffeeBased,
  ...soda,
  ...pastries,
  ...meals,
];

// Zero-latency microtask delay for maximum mobile performance
const delay = (ms = 0, signal) =>
  new Promise((resolve, reject) => {
    if (ms <= 0) {
      if (signal?.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      resolve();
      return;
    }
    const timer = setTimeout(() => resolve(), ms);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });

/**
 * High-performance API Service providing instant data access,
 * offline caching via AsyncStorage, and abort signal support.
 */
export const api = {
  /**
   * Fetch all cafes with optional search query, caching, and abort signal support.
   */
  async fetchCafes({ signal, query = "" } = {}) {
    await delay(0, signal);

    try {
      let results = [...mockCafes];

      if (query.trim() !== "") {
        const lower = query.toLowerCase();
        results = results.filter(
          (c) =>
            c.name.toLowerCase().includes(lower) ||
            c.address.toLowerCase().includes(lower)
        );
      }

      // Non-blocking background cache update
      writeStoredJson(STORAGE_KEYS.CACHED_CAFES, results).catch(() => {});
      return results;
    } catch (err) {
      if (err.name === "AbortError") throw err;

      // Offline fallback: load cached cafes
      const cached = await readStoredJson(STORAGE_KEYS.CACHED_CAFES, mockCafes);
      return cached;
    }
  },

  /**
   * Fetch cafe details by ID immediately.
   */
  async fetchCafeById(id, { signal } = {}) {
    await delay(0, signal);
    const cafe = mockCafes.find((c) => c.id === id);
    if (!cafe) {
      throw new Error(`Cafe with ID ${id} not found.`);
    }
    return cafe;
  },

  /**
   * Fetch menu products grouped by category instantly.
   */
  async fetchMenu({ signal } = {}) {
    await delay(0, signal);
    try {
      const menuData = {
        coffeeBased,
        nonCoffeeBased,
        soda,
        pastries,
        meals,
      };
      writeStoredJson(STORAGE_KEYS.CACHED_PRODUCTS, menuData).catch(() => {});
      return menuData;
    } catch (err) {
      if (err.name === "AbortError") throw err;
      return readStoredJson(STORAGE_KEYS.CACHED_PRODUCTS, {
        coffeeBased,
        nonCoffeeBased,
        soda,
        pastries,
        meals,
      });
    }
  },

  /**
   * Fetch a single product by ID instantly.
   */
  async fetchProductById(id, { signal } = {}) {
    await delay(0, signal);
    const product = allMockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with ID "${id}" was not found.`);
    }
    return product;
  },

  /**
   * Submit a new coffee order to the backend instantly.
   */
  async submitOrder(orderPayload, { signal } = {}) {
    await delay(0, signal);

    if (!orderPayload || !Array.isArray(orderPayload.items) || orderPayload.items.length === 0) {
      throw new Error("Cannot submit an empty order.");
    }

    const orderNumber =
      "LC-" + Math.floor(100 + Math.random() * 900).toString();

    const createdOrder = {
      orderNumber,
      items: orderPayload.items,
      total: orderPayload.total,
      status: "Order Received",
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
    };

    return createdOrder;
  },

  /**
   * Fetch order status progression.
   */
  async fetchOrderStatus(orderNumber, { signal } = {}) {
    await delay(0, signal);
    const currentOrder = await readStoredJson(STORAGE_KEYS.CURRENT_ORDER, null);
    if (!currentOrder || currentOrder.orderNumber !== orderNumber) {
      return null;
    }

    const elapsedSeconds = Math.floor((Date.now() - (currentOrder.timestamp || Date.now())) / 1000);
    let status = "Order Received";
    if (elapsedSeconds > 30) {
      status = "Ready for Pick-up";
    } else if (elapsedSeconds > 15) {
      status = "Brewing / Handcrafting";
    } else if (elapsedSeconds > 5) {
      status = "Preparing Your Order";
    }

    if (currentOrder.status !== status) {
      currentOrder.status = status;
      writeStoredJson(STORAGE_KEYS.CURRENT_ORDER, currentOrder).catch(() => {});
    }

    return currentOrder;
  },
};
