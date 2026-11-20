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
import { ArrowLeft, Check } from "lucide-react-native";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";
import { readStoredJson } from "../utils/storage";

const steps = [
  "Order Received",
  "Preparing Your Order",
  "Brewing / Handcrafting",
  "Ready for Pick-up",
];

export default function OrderStatus() {
  const router = useRouter();
  const [scrollY] = useState(() => new Animated.Value(0));
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadStatus = async () => {
        setIsLoading(true);
        setLoadError("");
        try {
          const current = await readStoredJson("currentOrder", null);
          if (active) setOrder(current);
        } catch (error) {
          console.error("Failed to load the active order status.", error);
          if (active) setLoadError("Unable to load order status. Please try again.");
        } finally {
          if (active) setIsLoading(false);
        }
      };

      loadStatus();
      return () => {
        active = false;
      };
    }, [])
  );

  const currentIndex = order ? steps.indexOf(order.status) : -1;
  const isReady = order?.status === "Ready for Pick-up";

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

        <Text style={styles.pageTitle}>Order Status</Text>

        {isLoading ? (
          <ActivityIndicator color={colors.caramel} style={styles.loading} />
        ) : loadError !== "" ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : !order ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No active order found.</Text>
            <Pressable style={styles.primaryButton} onPress={() => router.dismissTo("/home")}>
              <Text style={styles.primaryText}>Back to Home</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.glassCard}>
            <View style={styles.orderBadge}>
              <Text style={styles.orderLabel}>Order Identifier</Text>
              <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
            </View>

            <View style={styles.stepList}>
              {steps.map((step, i) => {
                const done = i < currentIndex || isReady;
                const current = i === currentIndex && !isReady;
                return (
                  <View key={step} style={styles.stepRow}>
                    <View style={[styles.circle, done && styles.circleDone, current && styles.circleCurrent]}>
                      {done && <Check size={16} color={colors.white} strokeWidth={2.5} />}
                      {current && <View style={styles.currentDot} />}
                    </View>
                    <Text style={[styles.stepText, (done || current) && styles.stepTextActive]}>{step}</Text>
                  </View>
                );
              })}
            </View>

            {isReady ? (
              <View style={styles.readyBanner}>
                <Text style={styles.readyText}>Your order is ready for pickup!</Text>
              </View>
            ) : (
              <Text style={styles.waitText}>The cafe is handcrafting your order.</Text>
            )}

            <Pressable style={styles.homeButton} onPress={() => router.dismissTo("/home")}>
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </Pressable>
          </View>
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
  glassCard: {
    backgroundColor: colors.glassCard,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
  orderBadge: {
    alignItems: "center",
    backgroundColor: "rgba(18, 11, 8, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignSelf: "center",
    marginBottom: 24,
  },
  orderLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  orderNumber: { fontSize: 20, fontWeight: "bold", color: colors.caramel, marginTop: 2 },
  stepList: { gap: 20, marginBottom: 28 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassPill,
    alignItems: "center",
    justifyContent: "center",
  },
  circleDone: { backgroundColor: colors.ctaButton, borderColor: colors.ctaBorder },
  circleCurrent: { backgroundColor: "rgba(168, 132, 98, 0.2)", borderColor: colors.caramel },
  currentDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.caramel },
  stepText: { fontSize: 15, color: colors.textMuted, fontWeight: "500" },
  stepTextActive: { color: colors.white, fontWeight: "700" },
  readyBanner: {
    backgroundColor: "rgba(122, 78, 45, 0.25)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ctaBorder,
    marginBottom: 20,
  },
  readyText: { fontSize: 16, fontWeight: "bold", color: colors.white, textAlign: "center" },
  waitText: { fontSize: 14, color: colors.textSecondary, textAlign: "center", marginBottom: 20 },
  homeButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButton,
    paddingVertical: 15,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ctaBorder,
    shadowColor: colors.ctaButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  homeButtonText: { color: colors.white, fontSize: 16, fontWeight: "bold", letterSpacing: 0.3 },
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
  primaryButton: {
    backgroundColor: colors.ctaButton,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  primaryText: { color: colors.white, fontWeight: "bold", fontSize: 14 },
  loading: { marginTop: 40 },
  error: { textAlign: "center", color: "#E74C3C", marginTop: 20 },
});
