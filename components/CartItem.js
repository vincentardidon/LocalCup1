import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { coffeeBased, nonCoffeeBased, soda, pastries, meals } from "../data/products";
import { colors } from "../constants/colors";

const allProducts = [...coffeeBased, ...nonCoffeeBased, ...soda, ...pastries, ...meals];

export default function CartItem({ item, onRemove }) {
  const product = allProducts.find((p) => p.id === item.productId);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {product && <Image source={product.image} style={styles.image} />}
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <Text style={styles.price}>{"\u20B1"}{item.price}</Text>
      </View>

      <View style={styles.options}>
        {Object.entries(item.options).map(([title, value]) => (
          <Text key={title} style={styles.optionText}>{title}: {value}</Text>
        ))}
        {item.instructions ? (
          <Text style={styles.optionText}>Note: {item.instructions}</Text>
        ) : null}
      </View>

      <Pressable style={styles.removeButton} onPress={() => onRemove(item.cartId)}>
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glassCard,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 16,
    marginBottom: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  image: { width: 68, height: 68, borderRadius: 14, backgroundColor: colors.softPink },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 17, fontWeight: "bold", color: colors.white },
  category: { fontSize: 13, color: colors.textSecondary, fontWeight: "500" },
  price: { fontSize: 17, fontWeight: "bold", color: colors.caramel },
  options: {
    gap: 3,
    backgroundColor: "rgba(18, 11, 8, 0.45)",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  optionText: { fontSize: 13, color: colors.textMuted },
  removeButton: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(168, 132, 98, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  removeText: { color: colors.caramel, fontWeight: "600", fontSize: 12 },
});
