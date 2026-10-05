import { useCallback, useRef, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedHeader from "../components/AnimatedHeader";
import { colors } from "../constants/colors";

// The three steps of an order, in order
const steps = ["Order Received", "Preparing", "Ready for Pickup"];

export default function OrderStatus() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [order, setOrder] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Load the current order every time this page opens (the customer only views it)
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("currentOrder").then((saved) => {
        setOrder(saved ? JSON.parse(saved) : null);
        setLoaded(true);
      });
    }, [])
  );

  const currentIndex = order ? Math.max(steps.indexOf(order.status), 0) : 0;
  const isReady = currentIndex === steps.length - 1;

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

        <Text style={styles.pageTitle}>Order Status</Text>

        {loaded && !order ? (
          // Empty state: there is no order yet
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No active order yet.</Text>
            <Pressable style={styles.primaryButton} onPress={() => router.dismissTo("/home")}>
              <Text style={styles.primaryText}>Back to Home</Text>
            </Pressable>
          </View>
        ) : order ? (
          <>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>

            {/* One row for each step: check = done, filled dot = current, empty circle = waiting */}
            <View style={styles.stepList}>
              {steps.map((step, i) => {
                const done = i < currentIndex || isReady;
                const current = i === currentIndex && !isReady;
                return (
                  <View key={step} style={styles.stepRow}>
                    <View style={[styles.circle, done && styles.circleDone, current && styles.circleCurrent]}>
                      {done && <Check size={16} color={colors.white} />}
                    </View>
                    <Text style={[styles.stepText, (done || current) && styles.stepTextActive]}>{step}</Text>
                  </View>
                );
              })}
            </View>

            {isReady ? (
              <Text style={styles.readyText}>Your order is ready for pickup!</Text>
            ) : (
              <Text style={styles.waitText}>The cafe will update your order status.</Text>
            )}
          </>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingTop: 40 },
  content: { padding: 18, paddingBottom: 60 },
  backButton: { alignSelf: "flex-start", paddingVertical: 4, marginBottom: 8 },
  pageTitle: { fontSize: 26, fontWeight: "bold", color: colors.text },
  orderNumber: { fontSize: 20, fontWeight: "bold", color: colors.darkPink, marginTop: 6, marginBottom: 20 },
  stepList: { gap: 18, marginBottom: 30 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.softPink,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  circleDone: { backgroundColor: colors.rose, borderColor: colors.rose },
  circleCurrent: { backgroundColor: colors.dustyPink, borderColor: colors.darkPink },
  stepText: { fontSize: 18, color: colors.dustyPink },
  stepTextActive: { color: colors.text, fontWeight: "600" },
  readyText: { fontSize: 18, fontWeight: "bold", color: colors.darkPink, textAlign: "center" },
  waitText: { fontSize: 15, color: colors.rose, textAlign: "center" },
  primaryButton: { alignItems: "center", backgroundColor: colors.darkPink, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  emptyBox: { alignItems: "center", gap: 16, marginTop: 40 },
  emptyText: { fontSize: 17, color: colors.rose },
});
