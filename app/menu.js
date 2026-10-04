import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import CategorySection from "../components/CategorySection";
import { colors } from "../constants/colors";
import { coffeeBased, meals, nonCoffeeBased, pastries, soda } from "../data/products";

export default function Menu() {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // cafe name sent from Home

  // scrollY follows how far the page has been scrolled
  const scrollY = useRef(new Animated.Value(0)).current;

  // Scrolled 0 -> 100: scale goes 1 -> 0.7, height goes 110 -> 84
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
      {/* Animated header: shrinks when scrolling up, grows back when scrolling down */}
      <Animated.View style={[styles.header, { height: headerHeight, transform: [{ scale }] }]}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>LocalCup1</Text>
      </Animated.View>

      {/* Vertical scroll for the whole page */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Back arrow + Menu title */}
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <ArrowLeft size={26} color={colors.darkPink} />
          <Text style={styles.menuTitle}>Menu</Text>
        </Pressable>
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
  title: { fontSize: 24, fontWeight: "bold", color: colors.darkPink },
  content: { padding: 18, paddingBottom: 50 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  menuTitle: { fontSize: 24, fontWeight: "bold", color: colors.text },
  cafeName: { color: colors.rose, fontSize: 14, marginBottom: 16, marginLeft: 36 },
});