import { useRef, useState } from "react";
import { View, Text, Image, Pressable, TextInput, Animated, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomizationOption from "../components/CustomizationOption";
import { coffeeBased, nonCoffeeBased, soda, pastries, meals } from "../data/products";
import { colors } from "../constants/colors";

// All products in one list, so we can find the one the customer tapped
const allProducts = [...coffeeBased, ...nonCoffeeBased, ...soda, ...pastries, ...meals];

// Shared choices
const sizes = ["Small", "Medium", "Large", "Extra Large"];
const sugarLevels = ["No Sugar (0%)", "Less Sweet (25%-50%)", "Regular Sweet (100%)", "Extra Sweet (120%)"];

// Customization options for each category. defaultChoice is selected at the start.
const customOptions = {
  "Coffee Based": [
    { title: "Size", choices: sizes, defaultChoice: "Medium" },
    { title: "Coffee Type", choices: ["Hot", "Cold"], defaultChoice: "Hot" },
    { title: "Sugar Level", choices: sugarLevels, defaultChoice: "Regular Sweet (100%)" },
    {
      title: "Coffee Level",
      choices: ["Single Shot / Regular", "Double Shot / Extra Strong", "Half Caf", "Decaf"],
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
    { title: "Sweetness", choices: sugarLevels, defaultChoice: "Regular Sweet (100%)" },
    { title: "Milk Option", choices: ["No Milk", "Regular Milk", "Extra Milk"], defaultChoice: "Regular Milk" },
  ],
  Soda: [
    { title: "Size", choices: sizes, defaultChoice: "Medium" },
    { title: "Ice Level", choices: ["No Ice", "Less Ice", "Regular Ice", "Extra Ice"], defaultChoice: "Regular Ice" },
    { title: "Sweetness", choices: ["Regular", "Less Sweet"], defaultChoice: "Regular" },
  ],
  Pastries: [
    { title: "Size / Serving", choices: ["Regular", "Large"], defaultChoice: "Regular" },
    { title: "Warming", choices: ["Not Warmed", "Warmed"], defaultChoice: "Not Warmed" },
    { title: "Add-ons", choices: ["None", "Extra Butter", "Extra Sauce"], defaultChoice: "None" },
  ],
  Meals: [
    { title: "Size", choices: ["Regular", "Large"], defaultChoice: "Regular" },
    { title: "Temperature", choices: ["Regular", "Extra Hot"], defaultChoice: "Regular" },
    { title: "Add-ons", choices: ["None", "Extra Cheese", "Extra Sauce", "Extra Side"], defaultChoice: "None" },
  ],
};

export default function Customized() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // product id sent from the Menu page

  // Find the selected product, then get the options for its category
  const product = allProducts.find((p) => p.id === id);
  const sections = product ? customOptions[product.category] : [];

  // selected = the chosen option for each section, e.g. { Size: "Medium", ... }
  const [selected, setSelected] = useState(() => {
    const start = {};
    sections.forEach((section) => {
      start[section.title] = section.defaultChoice;
    });
    return start;
  });
  const [instructions, setInstructions] = useState("");

  // Header animation (same as the Menu page)
  const scrollY = useRef(new Animated.Value(0)).current;
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

  // Save the customized item into the "cart" list in AsyncStorage
  // Every option group must have a selected value
  const isComplete = () => sections.every((section) => selected[section.title]);

  const saveToCart = async () => {
    const item = {
      cartId: Date.now().toString(),
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      options: selected, // size, temperature, sweetness, strength, milk, add-ons...
      instructions: instructions,
      quantity: 1,
    };
    const saved = await AsyncStorage.getItem("cart"); // 1. get existing cart
    const cart = saved ? JSON.parse(saved) : [];
    cart.push(item); // 2. add the new item
    await AsyncStorage.setItem("cart", JSON.stringify(cart)); // 3. save it again
  };

  // Add to Cart: save, then go back to the Menu so the customer can keep ordering
  const handleAddToCart = async () => {
    if (!isComplete()) {
      Alert.alert("Please complete your customization.");
      return;
    }
    await saveToCart();
    Alert.alert("Added to cart!", "You can keep ordering.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  // Check Out: save this item too (so the cart is never empty), then open the Coffee Cart
  const handleCheckOut = async () => {
    if (!isComplete()) {
      Alert.alert("Please complete your customization.");
      return;
    }
    await saveToCart();
    router.push("/coffee-cart");
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
      {/* Animated header: smaller when scrolling up, bigger when scrolling down */}
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
        {/* Back arrow */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={26} color={colors.darkPink} />
        </Pressable>

        {/* Product info: text on the left, picture on the right */}
        <View style={styles.productRow}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
            <Text style={styles.productPrice}>{"\u20B1"}{product.price}</Text>
          </View>
          <Image source={product.image} style={styles.productImage} />
        </View>

        <Text style={styles.sectionTitle}>Customize Your Order</Text>

        {/* One block of buttons for each option of this category */}
        {sections.map((section) => (
          <View key={section.title} style={styles.optionBlock}>
            <Text style={styles.optionTitle}>{section.title}</Text>
            <View style={styles.optionRow}>
              {section.choices.map((choice) => (
                <CustomizationOption
                  key={choice}
                  label={choice}
                  selected={selected[section.title] === choice}
                  onPress={() => setSelected({ ...selected, [section.title]: choice })}
                />
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Other Instructions</Text>
        <TextInput
          style={styles.input}
          placeholder="Add special instructions..."
          placeholderTextColor={colors.dustyPink}
          multiline
          value={instructions}
          onChangeText={setInstructions}
        />

        {/* Add to Cart on the left, Check Out on the right */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.cartButton} onPress={handleAddToCart}>
            <Text style={styles.cartText}>Add to Cart</Text>
          </Pressable>
          <Pressable style={styles.checkoutButton} onPress={handleCheckOut}>
            <Text style={styles.checkoutText}>Check Out</Text>
          </Pressable>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingTop: 40 },
  notFound: { textAlign: "center", marginTop: 60, color: colors.rose, fontSize: 16 },
  header: { alignItems: "center", justifyContent: "center", gap: 4 },
  logo: { width: 48, height: 48 },
  title: { fontSize: 24, fontWeight: "bold", color: colors.darkPink },
  content: { padding: 18, paddingBottom: 60 },
  backButton: { alignSelf: "flex-start", paddingVertical: 4, marginBottom: 8 },
  productRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontSize: 26, fontWeight: "bold", color: colors.text },
  productCategory: { fontSize: 15, color: colors.rose },
  productPrice: { fontSize: 18, fontWeight: "bold", color: colors.darkPink },
  productImage: { width: 120, height: 120, borderRadius: 18, backgroundColor: colors.softPink },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: colors.text, marginTop: 24, marginBottom: 12 },
  optionBlock: { marginBottom: 16 },
  optionTitle: { fontSize: 16, fontWeight: "600", color: colors.darkPink, marginBottom: 8 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  input: {
    minHeight: 90,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.beige,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: "top",
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginTop: 24 },
  cartButton: { flex: 1, alignItems: "center", backgroundColor: colors.darkPink, paddingVertical: 14, borderRadius: 14 },
  cartText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  checkoutButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.darkPink,
    paddingVertical: 14,
    borderRadius: 14,
  },
  checkoutText: { color: colors.darkPink, fontSize: 16, fontWeight: "bold" },
});

