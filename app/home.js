import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ClipboardList, LogOut } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import CafeCard from "../components/CafeCard";
import SearchBar from "../components/SearchBar";
import { colors } from "../constants/colors";
import { cafes } from "../data/cafes";
import { readStoredJson, writeStoredJson } from "../utils/storage";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Load saved favorites when the screen opens
  useEffect(() => {
    let active = true;

    const loadFavorites = async () => {
      try {
        const saved = await readStoredJson("favorites", []);
        if (!Array.isArray(saved)) throw new Error("Saved favorites are not a list.");
        if (active) setFavorites(saved);
      } catch (error) {
        console.error("Failed to load favorites.", error);
        if (active) Alert.alert("Unable to load favorites", "Please restart the app and try again.");
      }
    };

    loadFavorites();
    return () => {
      active = false;
    };
  }, []);

  // Add or remove a cafe ID, then save the list locally
  const toggleFavorite = async (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    try {
      await writeStoredJson("favorites", updated);
      setFavorites(updated);
    } catch (error) {
      console.error("Failed to save favorites.", error);
      Alert.alert("Unable to save favorite", "Please try again.");
    }
  };

  // Remove the login value and go back to the Login screen
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn");
      router.replace("/");
    } catch (error) {
      console.error("Failed to log out.", error);
      Alert.alert("Unable to log out", "Please try again.");
    }
  };

  // Simple search: keep cafes whose name contains the typed text
  const filteredCafes = cafes.filter((cafe) =>
    cafe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.spacer} />
        <View style={styles.titleRow}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.title}>LocalCup1</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.spacer}>
          <LogOut size={22} color={colors.darkPink} />
        </Pressable>
      </View>

      <SearchBar value={search} onChangeText={setSearch} />

      {/* Cafe's title on the left, Order History button on the right */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Cafes</Text>
        <Pressable style={styles.historyButton} onPress={() => router.push("/order-history")}>
          <ClipboardList size={18} color={colors.darkPink} />
          <Text style={styles.historyText}>Order History</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredCafes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No cafes found.</Text>}
        renderItem={({ item }) => (
          <CafeCard
            cafe={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingHorizontal: 18, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  spacer: { width: 30, alignItems: "flex-end" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 36, height: 36 },
  title: { fontSize: 26, fontWeight: "bold", color: colors.darkPink },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: colors.text },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.beige,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  historyText: { color: colors.darkPink, fontWeight: "600" },
  empty: { textAlign: "center", color: colors.rose, fontSize: 16, marginTop: 30 },
});
