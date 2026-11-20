import { useState } from "react";
import { View, Text, Image, Pressable, Animated, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ShoppingCart } from "lucide-react-native";
import CategorySection from "../components/CategorySection";
import { coffeeBased, nonCoffeeBased, soda, pastries, meals } from "../data/products";
import { colors } from "../constants/colors";

export default function Menu() {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  const [scrollY] = useState(() => new Animated.Value(0));

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
        <View style={styles.topRow}>
          <Pressable style={styles.backRow} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.white} />
            <Text style={styles.menuTitle}>Menu</Text>
          </Pressable>

          <Pressable style={styles.cartButton} onPress={() => router.push("/coffee-cart")}>
            <ShoppingCart size={16} color={colors.caramel} />
            <Text style={styles.cartText}>View Cart</Text>
          </Pressable>
        </View>
        {name ? <Text style={styles.cafeName}>{name}</Text> : null}

        <CategorySection title="Coffee Based" items={coffeeBased} />
        <CategorySection title="Non Coffee Based" items={nonCoffeeBased} />
        <CategorySection title="Soda" items={soda} />
        <CategorySection title="Pastries" items={pastries} />
        <CategorySection title="Meals" items={meals} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingTop: 40 },
  header: { alignItems: "center", justifyContent: "center", gap: 4 },
  logo: { width: 48, height: 48 },
  title: { fontSize: 24, fontWeight: "bold", color: colors.white, letterSpacing: 0.3 },
  content: { padding: 18, paddingBottom: 60 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  menuTitle: { fontSize: 18, fontWeight: "bold", color: colors.white },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  cartText: { color: colors.caramel, fontWeight: "700", fontSize: 13 },
  cafeName: { color: colors.caramel, fontSize: 14, fontWeight: "600", marginBottom: 16, marginTop: 4, marginLeft: 14 },
});
