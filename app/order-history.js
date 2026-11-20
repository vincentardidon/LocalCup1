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

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadHistory = async () => {
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

      loadHistory();
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
          <ArrowLeft size={18} color={colors.white} />
        </Pressable>

        <Text style={styles.pageTitle}>Order History</Text>

        {isLoading ? (
          <ActivityIndicator color={colors.caramel} style={styles.loading} />
        ) : loadError !== "" ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No previous orders yet.</Text>
            <Pressable style={styles.homeButton} onPress={() => router.dismissTo("/home")}>
              <Text style={styles.homeButtonText}>Explore Cafes</Text>
            </Pressable>
          </View>
        ) : (
          [...orders].reverse().map((order) => (
            <View key={order.orderNumber} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              <Text style={styles.dateText}>{order.date || "Recent"}</Text>
              <View style={styles.divider} />
              <View style={styles.cardFooter}>
                <Text style={styles.line}>
                  {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                </Text>
                <Text style={styles.total}>{"\u20B1"}{order.total}</Text>
              </View>
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
  card: {
    backgroundColor: colors.glassCard,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 18,
    marginBottom: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderNumber: { fontSize: 18, fontWeight: "bold", color: colors.white },
  statusBadge: {
    backgroundColor: "rgba(168, 132, 98, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(168, 132, 98, 0.4)",
  },
  statusText: { fontSize: 12, color: colors.caramel, fontWeight: "700" },
  dateText: { fontSize: 13, color: colors.textMuted },
  divider: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.08)", marginVertical: 4 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  line: { fontSize: 14, color: colors.textSecondary },
  total: { fontSize: 18, fontWeight: "bold", color: colors.caramel },
  emptyCard: {
    backgroundColor: colors.glassCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 32,
    alignItems: "center",
    gap: 16,
    marginTop: 20,
  },
  emptyText: { fontSize: 16, color: colors.textSecondary },
  homeButton: {
    backgroundColor: colors.ctaButton,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  homeButtonText: { color: colors.white, fontWeight: "bold", fontSize: 14 },
  loading: { marginTop: 40 },
  error: { textAlign: "center", color: "#E74C3C", marginTop: 20 },
});
