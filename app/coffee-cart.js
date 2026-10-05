import { useCallback, useRef, useState } from "react";
import { View, Text, Image, Pressable, Animated, Alert, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CartItem from "../components/CartItem";
import { colors } from "../constants/colors";

export default function CoffeeCart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);

  // Load the cart from AsyncStorage when the page opens
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

  // Add up all prices (works even if a price is saved as text like "P100")
  // Check Out: show the confirmation, then empty the cart (screen and AsyncStorage)
  const handleCheckout = () => {
    Alert.alert("Your order has been placed for checkout.", "", [
      {
        text: "OK",
        onPress: async () => {
          await AsyncStorage.removeItem("cart");
          setCart([]);
        },
      },
    ]);
  };
  const total = cart.reduce(
    (sum, item) => sum + Number(String(item.price).replace(/[^0-9.]/g, "")),
    0
  );

  // Header animation (same as Menu and Customized)
  const scrollY = useRef(new Animated.Value(0)).current;
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
      >
        <Pressable onPress={() => router.dismissTo("/menu")} style={styles.backButton}>
          <ArrowLeft size={26} color={colors.darkPink} />
        </Pressable>

        <Text style={styles.pageTitle}>Coffee Cart</Text>

        {cart.length === 0 ? (
          // Empty cart message
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
            >
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
  header: { alignItems: "center", justifyContent: "center", gap: 4 },
  logo: { width: 48, height: 48 },
  title: { fontSize: 24, fontWeight: "bold", color: colors.darkPink },
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



