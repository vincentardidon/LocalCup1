import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { coffeeBased, nonCoffeeBased, soda, pastries, meals } from "../data/products";
import { colors } from "../constants/colors";

// All products in one list, used to find the picture for a cart item
const allProducts = [...coffeeBased, ...nonCoffeeBased, ...soda, ...pastries, ...meals];

// Shows one customized item in the cart, with a Remove button
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

      {/* Only the options that were chosen for this product are shown */}
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
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.beige,
    padding: 14,
    marginBottom: 14,
    gap: 10,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  image: { width: 64, height: 64, borderRadius: 12, backgroundColor: colors.softPink },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 18, fontWeight: "bold", color: colors.text },
  category: { fontSize: 14, color: colors.rose },
  price: { fontSize: 18, fontWeight: "bold", color: colors.darkPink },
  options: { gap: 2 },
  optionText: { fontSize: 14, color: colors.text },
  removeButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rose,
  },
  removeText: { color: colors.rose, fontWeight: "600" },
});
