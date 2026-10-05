import { useCallback, useRef, useState } from "react";
import { View, Text, Pressable, Animated, Alert, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CartItem from "../components/CartItem";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";

export default function CoffeeCart() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [cart, setCart] = useState([]);

  // Load the cart from AsyncStorage every time this page opens
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("cart").then((saved) => {
        setCart(saved ? JSON.parse(saved) : []);
      });
    }, [])
  );

  // Remove one item, then save the new list and update the screen
  const handleRemove = async (cartId) => {
    const updated = cart.filter((item) => item.cartId !== cartId);
    setCart(updated);
    await AsyncStorage.setItem("cart", JSON.stringify(updated));
  };

  // Add up all prices (works even if a price is saved as text)
  const total = cart.reduce(
    (sum, item) => sum + Number(String(item.price).replace(/[^0-9.]/g, "")),
    0
  );

  // Check Out: save the order, clear the cart, open Order Confirmation
  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert("Your cart is empty.");
      return;
    }

    // 1. Get the old orders and make the next order number (LC-001, LC-002...)
    const saved = await AsyncStorage.getItem("orderHistory");
    const orders = saved ? JSON.parse(saved) : [];
    const orderNumber = "LC-" + String(orders.length + 1).padStart(3, "0");

    // 2. Create the completed order
    const newOrder = {
      orderNumber: orderNumber,
      items: cart,
      total: total,
      status: "Order Received",
      date: new Date().toLocaleString(),
    };

    // 3. Save it in Order History and as the current order
    orders.push(newOrder);
    await AsyncStorage.setItem("orderHistory", JSON.stringify(orders));
    await AsyncStorage.setItem("currentOrder", JSON.stringify(newOrder));

    // 4. Clear the active cart
    await AsyncStorage.removeItem("cart");
    setCart([]);

    // 5. Show the confirmation page
    router.replace("/order-confirmation");
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

        {cart.length === 0 ? (
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

            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Check Out</Text>
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
});
