import { useRouter } from "expo-router";
import { ClipboardList, LogOut, ShoppingCart } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CafeCard from "../components/CafeCard";
import SearchBar from "../components/SearchBar";
import { colors } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { api } from "../services/api";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { cartCount } = useCart();

  const [search, setSearch] = useState("");
  const [cafes, setCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);

  // API Fetching & Lifecycle: Load cafes with AbortController support
  const loadCafes = useCallback(
    async (searchQuery = "", showSpinner = true) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (showSpinner) setIsLoading(true);
      setError("");

      try {
        const data = await api.fetchCafes({
          signal: abortControllerRef.current.signal,
          query: searchQuery,
        });
        setCafes(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("[Home] Error fetching cafes:", err);
          setError(
            "Unable to load cafes right now. Please pull down to refresh.",
          );
        }
      } finally {
        if (showSpinner) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  // Lifecycle: Fetch on mount & when search text changes (with debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      loadCafes(search, false);
    }, 250);

    return () => {
      clearTimeout(handler);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [search, loadCafes]);

  // Initial load
  useEffect(() => {
    loadCafes("", true);
  }, [loadCafes]);

  // AppState Lifecycle: Auto-refresh data when app returns to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        loadCafes(search, false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [search, loadCafes]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadCafes(search, false);
  }, [search, loadCafes]);

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Cart Quick Access */}
        <Pressable
          onPress={() => router.push("/coffee-cart")}
          style={styles.headerPillButton}
        >
          <ShoppingCart size={17} color={colors.caramel} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.titleRow}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>LocalCup1</Text>
        </View>

        <Pressable onPress={handleLogout} style={styles.headerPillButton}>
          <LogOut size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <SearchBar value={search} onChangeText={setSearch} />

      {/* Section Row */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Featured Cafes</Text>
        <Pressable
          style={styles.historyButton}
          onPress={() => router.push("/order-history")}
        >
          <ClipboardList size={15} color={colors.caramel} />
          <Text style={styles.historyText}>Order History</Text>
        </Pressable>
      </View>

      {/* Main List with Pull-To-Refresh and Loading State */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.caramel} />
          <Text style={styles.loadingText}>Discovering local cafes...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => loadCafes(search, true)}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={cafes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.caramel}
              colors={[colors.caramel]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {search
                ? `No cafes matching "${search}".`
                : "No cafes available."}
            </Text>
          }
          renderItem={({ item }) => (
            <CafeCard
              cafe={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerPillButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.ctaButton,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.ctaBorder,
  },
  cartBadgeText: { color: colors.white, fontSize: 10, fontWeight: "bold" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 36, height: 36 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 0.3,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 0.2,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  historyText: { color: colors.caramel, fontWeight: "600", fontSize: 13 },
  listContent: { paddingBottom: 30 },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 14,
  },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  errorText: { color: "#E74C3C", fontSize: 15, textAlign: "center" },
  retryButton: {
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  retryButtonText: { color: colors.caramel, fontWeight: "600", fontSize: 14 },
  empty: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 40,
  },
});
