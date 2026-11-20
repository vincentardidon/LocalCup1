import { Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../constants/colors";

// Reusable dark glass product card matching the 2x2 grid in reference screenshot.
export default function ProductCard({ product }) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: "/customized", params: { id: product.id } })}
    >
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.price}>{"\u20B1"}{product.price}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: colors.glassCard,
    borderRadius: 20,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 110,
    borderRadius: 14,
    resizeMode: "cover",
    backgroundColor: colors.softPink,
  },
  name: { fontSize: 14, fontWeight: "600", color: colors.white, marginTop: 2 },
  price: { fontSize: 14, color: colors.caramel, fontWeight: "bold" },
});
