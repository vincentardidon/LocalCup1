import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, ShoppingCart } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CategorySection from "../components/CategorySection";
import { colors } from "../constants/colors";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

export default function Menu() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const { cartCount } = useCart();

  const [scrollY] = useState(() => new Animated.Value(0));
  const [menu, setMenu] = useState({
    coffeeBased: [],
    nonCoffeeBased: [],
    soda: [],
    pastries: [],
    meals: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);

  // API Fetching & Lifecycle: Load menu items with AbortController
  const loadMenu = useCallback(async (showSpinner = true) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (showSpinner) setIsLoading(true);
    setError("");

    try {
      const data = await api.fetchMenu({
        signal: abortControllerRef.current.signal,
      });
      setMenu(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("[Menu] Error loading menu:", err);
        setError("Unable to load menu right now. Pull down to retry.");
      }
    } finally {
      if (showSpinner) setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMenu(true);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadMenu]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadMenu(false);
  }, [loadMenu]);

  const scale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.7],
    extrapolate: "clamp",
  });
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [110, 84],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight, transform: [{ scale }] }]}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>LocalCup1</Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.caramel}
            colors={[colors.caramel]}
          />
        }
      >
        <View style={styles.topRow}>
          <Pressable style={styles.backRow} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.white} />
            <Text style={styles.menuTitle}>Menu</Text>
          </Pressable>

          <Pressable style={styles.cartButton} onPress={() => router.push("/coffee-cart")}>
            <View style={styles.cartIconWrapper}>
              <ShoppingCart size={16} color={colors.caramel} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.cartText}>View Cart</Text>
          </Pressable>
        </View>

        {name ? <Text style={styles.cafeName}>{name}</Text> : null}

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.caramel} />
            <Text style={styles.loadingText}>Loading handcrafted menu...</Text>
          </View>
        ) : error ? (
          <View style={styles.loadingBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => loadMenu(true)}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <CategorySection title="Coffee Based" items={menu.coffeeBased} />
            <CategorySection title="Non Coffee Based" items={menu.nonCoffeeBased} />
            <CategorySection title="Soda" items={menu.soda} />
            <CategorySection title="Pastries" items={menu.pastries} />
            <CategorySection title="Meals" items={menu.meals} />
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingTop: 40 },
  header: { alignItems: "center", justifyContent: "center", gap: 4 },
  logo: { width: 48, height: 48 },
  title: { fontSize: 24, fontWeight: "bold", color: colors.white, letterSpacing: 0.3 },
  content: { padding: 18, paddingBottom: 60 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  menuTitle: { fontSize: 18, fontWeight: "bold", color: colors.white },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  cartIconWrapper: { position: "relative" },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: colors.ctaButton,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.ctaBorder,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "bold" },
  cartText: { color: colors.caramel, fontWeight: "700", fontSize: 13 },
  cafeName: { color: colors.caramel, fontSize: 14, fontWeight: "600", marginBottom: 16, marginTop: 4, marginLeft: 14 },
  loadingBox: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 14 },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  errorText: { color: "#E74C3C", fontSize: 14, textAlign: "center" },
  retryButton: {
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  retryButtonText: { color: colors.caramel, fontWeight: "600", fontSize: 13 },
});
