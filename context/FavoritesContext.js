import React, { createContext, useContext, useEffect, useState } from "react";
import { readStoredJson, STORAGE_KEYS, writeStoredJson } from "../utils/storage";

const FavoritesContext = createContext({
  favorites: [],
  isLoadingFavorites: true,
  toggleFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  // Lifecycle: Load initial favorites from storage
  useEffect(() => {
    let isMounted = true;

    async function loadSavedFavorites() {
      try {
        const saved = await readStoredJson(STORAGE_KEYS.FAVORITES, []);
        if (isMounted && Array.isArray(saved)) {
          setFavorites(saved);
        }
      } catch (err) {
        console.error("[FavoritesContext] Error loading favorites:", err);
      } finally {
        if (isMounted) setIsLoadingFavorites(false);
      }
    }

    loadSavedFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavorite = async (cafeId) => {
    const nextFavorites = favorites.includes(cafeId)
      ? favorites.filter((id) => id !== cafeId)
      : [...favorites, cafeId];

    setFavorites(nextFavorites);
    await writeStoredJson(STORAGE_KEYS.FAVORITES, nextFavorites);
  };

  const isFavorite = (cafeId) => favorites.includes(cafeId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoadingFavorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
