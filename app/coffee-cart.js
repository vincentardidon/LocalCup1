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
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  // Load the cart from AsyncStorage every time this page opens
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

  // Remove one item, then save the new list and update the screen
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

  // Add up all prices (works even if a price is saved as text)
  const total = cart.reduce(
    (sum, item) => sum + Number(String(item.price).replace(/[^0-9.]/g, "")),
    0
  );

  // Check Out: save the order, clear the cart, open Order Confirmation
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

      await writeStoredJson("currentOrder", newOrder);
      if (!orders.some((order) => order.orderNumber === newOrder.orderNumber)) {
        orders.push(newOrder);
        await writeStoredJson("orderHistory", orders);
      }
      await AsyncStorage.removeItem("cart");
      setCart([]);
      router.replace("/order-confirmation");
    } catch (error) {
      console.error("Failed to complete checkout.", error);
      setActionError("Unable to complete checkout. Your cart has been kept; please try again.");
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
        <Pressable onPress={() => router.dismissTo("/menu")} style={styles.backButton}>
          <ArrowLeft size={26} color={colors.darkPink} />
        </Pressable>

        <Text style={styles.pageTitle}>Coffee Cart</Text>

        {actionError !== "" && <Text style={styles.error}>{actionError}</Text>}

        {isLoading ? (
          <ActivityIndicator color={colors.darkPink} style={styles.loading} />
        ) : loadError !== "" ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : cart.length === 0 ? (
          // Empty cart: no Check Out button is shown
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Your coffee cart is empty.</Text>
            <Pressable style={styles.menuButton} onPress={() => router.dismissTo("/menu")}>
              <Text style={styles.menuButtonText}>Back to Menu</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <CartItem key={item.cartId} item={item} onRemove={handleRemove} />
            ))}

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
                <Text style={styles.checkoutText}>Check Out</Text>
              )}
            </Pressable>
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingTop: 40 },
  content: { padding: 18, paddingBottom: 60 },
  backButton: { alignSelf: "flex-start", paddingVertical: 4, marginBottom: 8 },
  pageTitle: { fontSize: 26, fontWeight: "bold", color: colors.text, marginBottom: 16 },
  emptyBox: { alignItems: "center", gap: 16, marginTop: 40 },
  emptyText: { fontSize: 17, color: colors.rose },
  menuButton: { backgroundColor: colors.darkPink, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 14 },
  menuButtonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.softPink,
    paddingTop: 16,
    marginTop: 6,
  },
  totalLabel: { fontSize: 20, fontWeight: "bold", color: colors.text },
  totalValue: { fontSize: 20, fontWeight: "bold", color: colors.darkPink },
  checkoutButton: { alignItems: "center", backgroundColor: colors.darkPink, paddingVertical: 16, borderRadius: 14, marginTop: 20 },
  checkoutText: { color: colors.white, fontSize: 17, fontWeight: "bold" },
  loading: { marginTop: 40 },
  error: { color: colors.rose, textAlign: "center", marginTop: 16 },
});
