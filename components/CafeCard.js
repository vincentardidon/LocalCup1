import { View, Text, Image, ImageBackground, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Heart, Star } from "lucide-react-native";
import { colors } from "../constants/colors";

export default function CafeCard({ cafe, isFavorite, onToggleFavorite }) {
  const router = useRouter();

  return (
    <ImageBackground
      source={cafe.backgroundImage}
      style={styles.card}
      imageStyle={styles.cardImage}
    >
      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <View style={styles.info}>
            <Text style={styles.name}>{cafe.name}</Text>
            <Text style={styles.address}>{cafe.address}</Text>
            <View style={styles.ratingBadge}>
              <Star size={12} color={colors.caramel} fill={colors.caramel} />
              <Text style={styles.rating}>{cafe.rating}</Text>
            </View>
          </View>

          <Pressable onPress={() => onToggleFavorite(cafe.id)} style={styles.heartButton}>
            <Heart
              size={18}
              color={isFavorite ? colors.caramel : colors.white}
              fill={isFavorite ? colors.caramel : "transparent"}
            />
          </Pressable>
        </View>

        <Image source={cafe.logo} style={styles.logo} />

        <Pressable
          style={styles.clickButton}
          onPress={() => router.push({ pathname: "/menu", params: { name: cafe.name } })}
        >
          <Text style={styles.clickText}>Explore Menu</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 270,
    marginBottom: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
  },
  cardImage: { borderRadius: 24 },
  overlay: {
    flex: 1,
    padding: 18,
    borderRadius: 24,
    backgroundColor: "rgba(18, 11, 8, 0.50)",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignSelf: "stretch" },
  info: { flex: 1, gap: 4 },
  name: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
  address: { color: colors.textSecondary, fontSize: 13 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: "rgba(18, 11, 8, 0.75)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 4,
  },
  rating: { color: colors.white, fontSize: 12, fontWeight: "700" },
  heartButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(18, 11, 8, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 72, height: 72 },
  clickButton: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  clickText: { color: colors.white, fontWeight: "700", fontSize: 14, letterSpacing: 0.3 },
});
