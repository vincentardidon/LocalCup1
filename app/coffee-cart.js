import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AnimatedHeader from "../components/AnimatedHeader";
import CartItem from "../components/CartItem";
import { colors } from "../constants/colors";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

export default function CoffeeCart() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const { placeOrder } = useOrders();

  const [scrollY] = useState(() => new Animated.Value(0));
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleRemove = (cartId) => {
    setActionError("");
    try {
      removeFromCart(cartId);
    } catch (error) {
      console.error("[Cart] Failed to remove item:", error);
      setActionError("Unable to remove this item. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || isCheckingOut) {
      if (cart.length === 0) Alert.alert("Your cart is empty.");
      return;
    }

    setIsCheckingOut(true);
    setActionError("");
    try {
      const order = await placeOrder(cart, cartTotal);
      if (order) {
        clearCart();
        router.push("/order-confirmation");
      } else {
        throw new Error("Order creation failed.");
      }
    } catch (error) {
      console.error("[Cart] Checkout error:", error);
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

        {cart.length === 0 ? (
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
                <Text style={styles.totalValue}>{"\u20B1"}{cartTotal}</Text>
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
  error: { color: "#E74C3C", textAlign: "center", marginTop: 16 },
});
