import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchBar from "../components/SearchBar";
import CafeCard from "../components/CafeCard";
import { cafes } from "../data/cafes";
import { colors } from "../constants/colors";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("favorites").then((saved) => {
      if (saved) setFavorites(JSON.parse(saved));
    });
  }, []);

  const toggleFavorite = async (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    router.replace("/");
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
        <Pressable onPress={handleLogout} style={styles.spacer}>
          <LogOut size={22} color={colors.darkPink} />
        </Pressable>
      </View>

      <SearchBar value={search} onChangeText={setSearch} />

      <Text style={styles.sectionTitle}>Cafe's</Text>

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
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: colors.text, marginTop: 20, marginBottom: 12 },
  empty: { textAlign: "center", color: colors.rose, fontSize: 16, marginTop: 30 },
});
