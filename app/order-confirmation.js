import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";
import { useOrders } from "../context/OrderContext";

export default function OrderConfirmation() {
  const router = useRouter();
  const { currentOrder, isLoadingOrders } = useOrders();

  return (
    <View style={styles.container}>
      <AnimatedHeader scrollY={{ interpolate: () => 1 }} />

      <View style={styles.content}>
        <View style={styles.glassCard}>
          <View style={styles.checkCircle}>
            <Check size={36} color={colors.white} strokeWidth={3} />
          </View>

          <Text style={styles.heading}>Order Confirmed!</Text>
          <Text style={styles.message}>Your order has been sent to the barista.</Text>

          {isLoadingOrders ? (
            <ActivityIndicator color={colors.caramel} />
          ) : currentOrder?.orderNumber ? (
            <View style={styles.orderBadge}>
              <Text style={styles.orderLabel}>Order Identifier</Text>
              <Text style={styles.orderNumber}>#{currentOrder.orderNumber}</Text>
            </View>
          ) : (
            <Text style={styles.error}>No active order details found.</Text>
          )}

          <Pressable style={styles.primaryButton} onPress={() => router.replace("/order-status")}>
            <Text style={styles.primaryText}>Track Order Status</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.replace("/home")}>
            <Text style={styles.secondaryText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.espresso, paddingTop: 40 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 22 },
  glassCard: {
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: colors.glassCard,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: 36,
    paddingHorizontal: 22,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  checkCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.ctaButton,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.ctaBorder,
    shadowColor: colors.ctaButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  heading: { fontSize: 26, fontWeight: "bold", color: colors.white, letterSpacing: 0.2 },
  message: { fontSize: 15, color: colors.textSecondary, textAlign: "center" },
  orderBadge: {
    alignItems: "center",
    backgroundColor: "rgba(18, 11, 8, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginVertical: 4,
  },
  orderLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  orderNumber: { fontSize: 22, fontWeight: "bold", color: colors.caramel, marginTop: 2 },
  primaryButton: {
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: colors.ctaButton,
    paddingVertical: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ctaBorder,
    marginTop: 6,
    shadowColor: colors.ctaButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: "bold", letterSpacing: 0.3 },
  secondaryButton: {
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: 15,
    borderRadius: 999,
  },
  secondaryText: { color: colors.white, fontSize: 15, fontWeight: "bold" },
  error: { color: "#E74C3C", textAlign: "center" },
});
