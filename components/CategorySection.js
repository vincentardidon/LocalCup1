import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import ProductCard from "./ProductCard";

// Reusable section: a title and a row of products that scrolls sideways
export default function CategorySection({ title, items }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  title: { fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 10 },
  row: { gap: 12 },
});