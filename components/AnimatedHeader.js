import { Text, Image, Animated, StyleSheet } from "react-native";
import { colors } from "../constants/colors";

// The LocalCup1 logo + title. It shrinks when the page is scrolled up
// (scrollY is the scroll position sent from the page).
export default function AnimatedHeader({ scrollY }) {
  const scale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.7],
    extrapolate: "clamp",
  });
  const height = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [110, 84],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.header, { height, transform: [{ scale }] }]}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>LocalCup1</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", justifyContent: "center", gap: 4 },
  logo: { width: 48, height: 48 },
  title: { fontSize: 24, fontWeight: "bold", color: colors.darkPink },
});
