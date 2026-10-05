import { useCallback, useRef, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";

export default function OrderHistory() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [orders, setOrders] = useState([]);

  // Load the saved orders every time this page opens
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("orderHistory").then((saved) => {
        setOrders(saved ? JSON.parse(saved) : []);
      });
    }, [])
  );

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
        <Pressable onPress={() => router.dismissTo("/home")} style={styles.backButton}>
          <ArrowLeft size={26} color={colors.darkPink} />
        </Pressable>

        <Text style={styles.pageTitle}>Order History</Text>

        {orders.length === 0 ? (
          // Empty state
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No previous orders yet.</Text>
            <Pressable style={styles.homeButton} onPress={() => router.dismissTo("/home")}>
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </Pressable>
          </View>
        ) : (
          // Newest order first
          [...orders].reverse().map((order) => (
            <View key={order.orderNumber} style={styles.card}>
              <Text style={styles.orderNumber}>{order.orderNumber}</Text>
              <Text style={styles.line}>
                {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
              </Text>
              <Text style={styles.total}>{"\u20B1"}{order.total}</Text>
              <Text style={styles.status}>{order.status}</Text>
            </View>
          ))
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.beige,
    padding: 16,
    marginBottom: 14,
    gap: 4,
  },
  orderNumber: { fontSize: 18, fontWeight: "bold", color: colors.darkPink },
  line: { fontSize: 15, color: colors.text },
  total: { fontSize: 17, fontWeight: "bold", color: colors.text },
  status: { fontSize: 15, color: colors.rose, fontWeight: "600" },
  emptyBox: { alignItems: "center", gap: 16, marginTop: 40 },
  emptyText: { fontSize: 17, color: colors.rose },
  homeButton: { backgroundColor: colors.darkPink, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 14 },
  homeButtonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
});
