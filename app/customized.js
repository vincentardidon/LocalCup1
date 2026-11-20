import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CustomizationOption from "../components/CustomizationOption";
import { colors } from "../constants/colors";
import {
  coffeeBased,
  meals,
  nonCoffeeBased,
  pastries,
  soda,
} from "../data/products";
import { readStoredJson, writeStoredJson } from "../utils/storage";

const allProducts = [
  ...coffeeBased,
  ...nonCoffeeBased,
  ...soda,
  ...pastries,
  ...meals,
];
const sizes = ["Small", "Medium", "Large", "Extra Large"];
const sugarLevels = [
  "No Sugar (0%)",
  "Less Sweet (25%-50%)",
  "Regular Sweet (100%)",
  "Extra Sweet (120%)",
];

const customOptions = {
  "Coffee Based": [
    { title: "Size", choices: sizes, defaultChoice: "Medium" },
    { title: "Coffee Type", choices: ["Hot", "Cold"], defaultChoice: "Hot" },
    {
      title: "Sugar Level",
      choices: sugarLevels,
      defaultChoice: "Regular Sweet (100%)",
    },
    {
      title: "Coffee Level",
      choices: [
        "Single Shot / Regular",
        "Double Shot / Extra Strong",
        "Half Caf",
        "Decaf",
      ],
      defaultChoice: "Single Shot / Regular",
    },
    {
      title: "Milk & Cream Level",
      choices: ["Splash of Milk", "Regular / Latte Style", "No Milk / Black"],
      defaultChoice: "Regular / Latte Style",
    },
  ],
  "Non Coffee Based": [
    { title: "Size", choices: sizes, defaultChoice: "Medium" },
    { title: "Temperature", choices: ["Hot", "Cold"], defaultChoice: "Hot" },
    {
      title: "Sweetness",
      choices: sugarLevels,
      defaultChoice: "Regular Sweet (100%)",
    },
    {
      title: "Milk Option",
      choices: ["No Milk", "Regular Milk", "Extra Milk"],
      defaultChoice: "Regular Milk",
    },
  ],
  Soda: [
    { title: "Size", choices: sizes, defaultChoice: "Medium" },
    {
      title: "Ice Level",
      choices: ["No Ice", "Less Ice", "Regular Ice", "Extra Ice"],
      defaultChoice: "Regular Ice",
    },
    {
      title: "Sweetness",
      choices: ["Regular", "Less Sweet"],
      defaultChoice: "Regular",
    },
  ],
  Pastries: [
    {
      title: "Size / Serving",
      choices: ["Regular", "Large"],
      defaultChoice: "Regular",
    },
    {
      title: "Warming",
      choices: ["Not Warmed", "Warmed"],
      defaultChoice: "Not Warmed",
    },
    {
      title: "Add-ons",
      choices: ["None", "Extra Butter", "Extra Sauce"],
      defaultChoice: "None",
    },
  ],
  Meals: [
    { title: "Size", choices: ["Regular", "Large"], defaultChoice: "Regular" },
    {
      title: "Temperature",
      choices: ["Regular", "Extra Hot"],
      defaultChoice: "Regular",
    },
    {
      title: "Add-ons",
      choices: ["None", "Extra Cheese", "Extra Sauce", "Extra Side"],
      defaultChoice: "None",
    },
  ],
};

export default function Customized() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const product =
    typeof id === "string" ? allProducts.find((p) => p.id === id) : undefined;
  const sections = product ? customOptions[product.category] : [];

  const [selected, setSelected] = useState(() => {
    const start = {};
    sections.forEach((section) => {
      start[section.title] = section.defaultChoice;
    });
    return start;
  });
  const [instructions, setInstructions] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const buildCartItem = () => {
    if (!product) return null;
    return {
      cartId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      options: selected,
      instructions: instructions.trim(),
    };
  };

  const handleAddToCart = async () => {
    if (!product || isSaving) return;
    const newItem = buildCartItem();
    if (!newItem) return;

    setIsSaving(true);
    try {
      const existing = await readStoredJson("cart", []);
      if (!Array.isArray(existing))
        throw new Error("Saved cart is not a list.");
      await writeStoredJson("cart", [...existing, newItem]);
      Alert.alert("Added to Cart!", `${product.name} was added.`, [
        { text: "View Cart", onPress: () => router.push("/coffee-cart") },
        { text: "Keep Browsing", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Failed to add an item to the cart.", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckOut = async () => {
    if (!product || isSaving) return;
    const newItem = buildCartItem();
    if (!newItem) return;

    setIsSaving(true);
    try {
      const existing = await readStoredJson("cart", []);
      if (!Array.isArray(existing))
        throw new Error("Saved cart is not a list.");
      await writeStoredJson("cart", [...existing, newItem]);
      router.push("/coffee-cart");
    } catch (error) {
      console.error("Failed to save and check out.", error);
      Alert.alert("Unable to proceed to checkout", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { height: headerHeight, transform: [{ scale }] },
        ]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>LocalCup1</Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={18} color={colors.white} />
        </Pressable>

        <View style={styles.heroGlassCard}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
            <Text style={styles.productPrice}>
              {"\u20B1"}
              {product.price}
            </Text>
          </View>
          <Image source={product.image} style={styles.productImage} />
        </View>

        <Text style={styles.sectionTitle}>Customize Your Cup</Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.optionBlock}>
            <Text style={styles.optionTitle}>{section.title}</Text>
            <View style={styles.optionRow}>
              {section.choices.map((choice) => (
                <CustomizationOption
                  key={choice}
                  label={choice}
                  selected={selected[section.title] === choice}
                  onPress={() =>
                    setSelected({ ...selected, [section.title]: choice })
                  }
                />
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Special Notes</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., extra hot, oat milk, less ice..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={instructions}
          onChangeText={setInstructions}
        />

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.cartButton}
            onPress={handleAddToCart}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.cartText}>Add to Cart</Text>
            )}
          </Pressable>
          <Pressable
            style={styles.checkoutButton}
            onPress={handleCheckOut}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.checkoutText}>Check Out</Text>
            )}
          </Pressable>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingTop: 40 },
  notFound: {
    textAlign: "center",
    marginTop: 60,
    color: colors.textSecondary,
    fontSize: 16,
  },
  header: { alignItems: "center", justifyContent: "center", gap: 4 },
  logo: { width: 48, height: 48 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 0.3,
  },
  content: { padding: 18, paddingBottom: 60 },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroGlassCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.glassCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  productInfo: { flex: 1, gap: 4 },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    letterSpacing: 0.2,
  },
  productCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.caramel,
    marginTop: 4,
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 18,
    backgroundColor: colors.softPink,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  optionBlock: { marginBottom: 18 },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 10,
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  input: {
    minHeight: 90,
    backgroundColor: colors.glassInput,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 18,
    padding: 14,
    fontSize: 14,
    color: colors.white,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 26,
  },
  cartButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ctaButton,
    paddingVertical: 15,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ctaBorder,
    shadowColor: colors.ctaButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  cartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  checkoutButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: 15,
    borderRadius: 999,
  },
  checkoutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
});
