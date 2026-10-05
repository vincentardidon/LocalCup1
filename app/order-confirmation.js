import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";

export default function OrderConfirmation() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [orderNumber, setOrderNumber] = useState("");

  // Read the order that was just saved at checkout
  useEffect(() => {
    AsyncStorage.getItem("currentOrder").then((saved) => {
      if (saved) setOrderNumber(JSON.parse(saved).orderNumber);
    });
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
        {orderNumber !== "" && <Text style={styles.orderNumber}>Order #{orderNumber}</Text>}

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
});
