import AsyncStorage from "@react-native-async-storage/async-storage";

export async function readStoredJson(key, fallback) {
  const saved = await AsyncStorage.getItem(key);
  return saved === null ? fallback : JSON.parse(saved);
}

export async function writeStoredJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
