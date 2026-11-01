import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";
import { readStoredJson } from "../utils/storage";

export default function OrderHistory() {
  const router = useRouter();
  const [scrollY] = useState(() => new Animated.Value(0));
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Load the saved orders every time this page opens
  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadOrders = async () => {
        setIsLoading(true);
        setLoadError("");
        try {
          const savedOrders = await readStoredJson("orderHistory", []);
          if (!Array.isArray(savedOrders)) throw new Error("Saved order history is not a list.");
          if (active) setOrders(savedOrders);
        } catch (error) {
          console.error("Failed to load order history.", error);
          if (active) setLoadError("Unable to load order history. Please try again.");
        } finally {
          if (active) setIsLoading(false);
        }
      };

      loadOrders();
      return () => {
        active = false;
      };
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

        {isLoading ? (
          <ActivityIndicator color={colors.darkPink} style={styles.loading} />
        ) : loadError !== "" ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : orders.length === 0 ? (
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
  loading: { marginTop: 40 },
  error: { textAlign: "center", color: colors.rose, marginTop: 20 },
});
