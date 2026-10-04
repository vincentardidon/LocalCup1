import { Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../constants/colors";

// Reusable card. Tapping it opens the Customized page and sends the product id.
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
    width: 140,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.beige,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: colors.softPink,
  },
  name: { fontSize: 15, fontWeight: "600", color: colors.text },
  price: { fontSize: 14, color: colors.rose, fontWeight: "bold" },
});
