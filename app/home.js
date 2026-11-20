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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn");
      router.replace("/");
    } catch (error) {
      console.error("Failed to log out.", error);
      Alert.alert("Unable to log out", "Please try again.");
    }
  };

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
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <SearchBar value={search} onChangeText={setSearch} />

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Featured Cafes</Text>
        <Pressable style={styles.historyButton} onPress={() => router.push("/order-history")}>
          <ClipboardList size={15} color={colors.caramel} />
          <Text style={styles.historyText}>Order History</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredCafes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  spacer: { width: 38 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 36, height: 36 },
  title: { fontSize: 24, fontWeight: "bold", color: colors.white, letterSpacing: 0.3 },
  logoutButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 22, marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: colors.white, letterSpacing: 0.2 },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.glassPill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  historyText: { color: colors.caramel, fontWeight: "600", fontSize: 13 },
  listContent: { paddingBottom: 30 },
  empty: { textAlign: "center", color: colors.textMuted, fontSize: 16, marginTop: 40 },
});
