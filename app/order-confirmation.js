import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";
import { readStoredJson } from "../utils/storage";

export default function OrderConfirmation() {
  const router = useRouter();
  const [scrollY] = useState(() => new Animated.Value(0));
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Read the order that was just saved at checkout
  useEffect(() => {
    let active = true;

    const loadCurrentOrder = async () => {
      try {
        const order = await readStoredJson("currentOrder", null);
        if (!order || typeof order.orderNumber !== "string") {
          throw new Error("No saved current order was found.");
        }
        if (active) setOrderNumber(order.orderNumber);
      } catch (error) {
        console.error("Failed to load the confirmed order.", error);
        if (active) setLoadError("Unable to load your order details.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadCurrentOrder();
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedHeader scrollY={scrollY} />

      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Check size={40} color={colors.white} />
        </View>

        <Text style={styles.heading}>Order Confirmed!</Text>
        <Text style={styles.message}>Your order has been received.</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.darkPink} />
        ) : loadError !== "" ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : (
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
        )}

        <Pressable style={styles.primaryButton} onPress={() => router.replace("/order-status")}>
          <Text style={styles.primaryText}>View Order Status</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.dismissTo("/home")}>
          <Text style={styles.secondaryText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingTop: 40 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 14 },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.rose,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: { fontSize: 28, fontWeight: "bold", color: colors.text },
  message: { fontSize: 16, color: colors.rose },
  orderNumber: { fontSize: 20, fontWeight: "bold", color: colors.darkPink, marginBottom: 14 },
  primaryButton: { alignSelf: "stretch", alignItems: "center", backgroundColor: colors.darkPink, paddingVertical: 14, borderRadius: 14 },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  secondaryButton: {
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.darkPink,
    paddingVertical: 14,
    borderRadius: 14,
  },
  secondaryText: { color: colors.darkPink, fontSize: 16, fontWeight: "bold" },
  error: { color: colors.rose, textAlign: "center" },
});
