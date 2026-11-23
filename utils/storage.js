import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  AUTH_USER: "authUser",
  FAVORITES: "favorites",
  CART: "cart",
  CURRENT_ORDER: "currentOrder",
  ORDER_HISTORY: "orderHistory",
  CACHED_CAFES: "cachedCafes",
  CACHED_PRODUCTS: "cachedProducts",
};

/**
 * Safely read and parse JSON data from AsyncStorage.
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {Promise<T>}
 */
export async function readStoredJson(key, fallback) {
  try {
    const saved = await AsyncStorage.getItem(key);
    if (saved === null || saved === undefined) return fallback;
    return JSON.parse(saved);
  } catch (error) {
    console.error(`[Storage] Failed to read key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely serialize and write JSON data to AsyncStorage.
 * @param {string} key
 * @param {any} value
 * @returns {Promise<boolean>}
 */
export async function writeStoredJson(key, value) {
  try {
    const serialized = JSON.stringify(value);
    await AsyncStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to write key "${key}":`, error);
    return false;
  }
}

/**
 * Remove an item from AsyncStorage.
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export async function removeStoredItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to remove key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all app data keys from AsyncStorage.
 * @returns {Promise<boolean>}
 */
export async function clearAllStorage() {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error("[Storage] Failed to clear app storage:", error);
    return false;
  }
}
