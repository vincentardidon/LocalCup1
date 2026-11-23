import React, { createContext, useContext, useEffect, useState } from "react";
import { readStoredJson, removeStoredItem, STORAGE_KEYS, writeStoredJson } from "../utils/storage";

const AuthContext = createContext({
  user: null,
  isLoggedIn: false,
  isLoadingSession: true,
  login: async () => false,
  logout: async () => {},
});

export const MOCK_USER = {
  email: "user@localcup.com",
  password: "123456",
  name: "Vincent",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Lifecycle: Check saved user session on app start
  useEffect(() => {
    let isMounted = true;

    async function checkAuthSession() {
      try {
        const storedLogin = await readStoredJson(STORAGE_KEYS.IS_LOGGED_IN, false);
        const storedUser = await readStoredJson(STORAGE_KEYS.AUTH_USER, null);

        if (isMounted) {
          if (storedLogin && storedUser) {
            setUser(storedUser);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      } catch (err) {
        console.error("[AuthContext] Session verification failed:", err);
      } finally {
        if (isMounted) setIsLoadingSession(false);
      }
    }

    checkAuthSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    if (
      email.trim().toLowerCase() === MOCK_USER.email.toLowerCase() &&
      password === MOCK_USER.password
    ) {
      const authenticatedUser = {
        email: MOCK_USER.email,
        name: MOCK_USER.name,
        loginTime: new Date().toISOString(),
      };

      await writeStoredJson(STORAGE_KEYS.IS_LOGGED_IN, true);
      await writeStoredJson(STORAGE_KEYS.AUTH_USER, authenticatedUser);

      setUser(authenticatedUser);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await removeStoredItem(STORAGE_KEYS.IS_LOGGED_IN);
      await removeStoredItem(STORAGE_KEYS.AUTH_USER);
      setUser(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.error("[AuthContext] Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoadingSession,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
