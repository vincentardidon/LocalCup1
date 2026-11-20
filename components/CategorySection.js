import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import ProductCard from "./ProductCard";

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
  section: { marginBottom: 26 },
  title: { fontSize: 18, fontWeight: "bold", color: colors.white, marginBottom: 12, letterSpacing: 0.2 },
  row: { gap: 14, paddingRight: 10 },
});
