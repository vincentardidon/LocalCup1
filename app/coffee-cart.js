import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Pressable,
  Animated,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import CartItem from "../components/CartItem";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";
import { readStoredJson, writeStoredJson } from "../utils/storage";

export default function CoffeeCart() {
  const router = useRouter();
  const [scrollY] = useState(() => new Animated.Value(0));
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadCart = async () => {
        setIsLoading(true);
        setLoadError("");
        try {
          const savedCart = await readStoredJson("cart", []);
          if (!Array.isArray(savedCart)) throw new Error("Saved cart is not a list.");
          if (active) setCart(savedCart);
        } catch (error) {
          console.error("Failed to load the cart.", error);
          if (active) setLoadError("Unable to load your cart. Please try again.");
        } finally {
          if (active) setIsLoading(false);
        }
      };

      loadCart();
      return () => {
        active = false;
      };
    }, [])
  );

  const handleRemove = async (cartId) => {
    const updated = cart.filter((item) => item.cartId !== cartId);
    setActionError("");
    try {
      await writeStoredJson("cart", updated);
      setCart(updated);
    } catch (error) {
      console.error("Failed to remove a cart item.", error);
      setActionError("Unable to remove this item. Please try again.");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(String(item.price).replace(/[^0-9.]/g, "")),
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0 || isCheckingOut) {
      if (cart.length === 0) Alert.alert("Your cart is empty.");
      return;
    }

    setIsCheckingOut(true);
    setActionError("");
    try {
      const orders = await readStoredJson("orderHistory", []);
      if (!Array.isArray(orders)) throw new Error("Saved order history is not a list.");
      const savedOrder = await readStoredJson("currentOrder", null);
      const isRetrying = savedOrder
        && Array.isArray(savedOrder.items)
        && typeof savedOrder.orderNumber === "string"
        && savedOrder.items.length === cart.length
        && cart.every((item, index) => savedOrder.items[index].cartId === item.cartId);
      const newOrder = isRetrying
        ? savedOrder
        : {
            orderNumber: "LC-" + String(orders.length + 1).padStart(3, "0"),
            items: cart,
            total,
            status: "Order Received",
            date: new Date().toLocaleString(),
          };

      const updatedOrders = isRetrying ? orders : [newOrder, ...orders];
      await writeStoredJson("currentOrder", newOrder);
      await writeStoredJson("orderHistory", updatedOrders);
      await writeStoredJson("cart", []);

      setCart([]);
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Failed to check out.", error);
      setActionError("Unable to complete checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedHeader scrollY={scrollY} />

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={18} color={colors.white} />
        </Pressable>

        <Text style={styles.pageTitle}>Your Cart</Text>

        {isLoading ? (
          <ActivityIndicator color={colors.caramel} style={styles.loading} />
        ) : loadError !== "" ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : cart.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Your cart is empty.</Text>
            <Pressable style={styles.menuButton} onPress={() => router.back()}>
              <Text style={styles.menuButtonText}>Explore Menu</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {actionError !== "" && <Text style={styles.error}>{actionError}</Text>}

            {cart.map((item) => (
              <CartItem key={item.cartId} item={item} onRemove={handleRemove} />
            ))}

            <View style={styles.summaryCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{"\u20B1"}{total}</Text>
              </View>

              <Pressable
                style={styles.checkoutButton}
                onPress={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingTop: 40 },
  content: { padding: 18, paddingBottom: 60 },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  pageTitle: { fontSize: 26, fontWeight: "bold", color: colors.white, marginBottom: 18, letterSpacing: 0.2 },
  emptyCard: {
    backgroundColor: colors.glassCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 32,
    alignItems: "center",
    gap: 16,
    marginTop: 30,
  },
  emptyText: { fontSize: 16, color: colors.textSecondary },
  menuButton: {
    backgroundColor: colors.ctaButton,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ctaBorder,
  },
  menuButtonText: { color: colors.white, fontWeight: "bold", fontSize: 14 },
  summaryCard: {
    backgroundColor: colors.glassCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: colors.white },
  totalValue: { fontSize: 22, fontWeight: "bold", color: colors.caramel },
  checkoutButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ctaButton,
    paddingVertical: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ctaBorder,
    shadowColor: colors.ctaButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  checkoutText: { color: colors.white, fontSize: 16, fontWeight: "bold", letterSpacing: 0.3 },
  loading: { marginTop: 40 },
  error: { color: "#E74C3C", textAlign: "center", marginTop: 16 },
});
