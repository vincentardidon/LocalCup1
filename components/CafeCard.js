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
            <View style={styles.ratingRow}>
              <Star size={16} color={colors.beige} fill={colors.beige} />
              <Text style={styles.rating}>{cafe.rating}</Text>
            </View>
          </View>

          <Pressable onPress={() => onToggleFavorite(cafe.id)} style={styles.heartButton}>
            <Heart
              size={26}
              color={isFavorite ? colors.softPink : colors.white}
              fill={isFavorite ? colors.softPink : "transparent"}
            />
          </Pressable>
        </View>

        <Image source={cafe.logo} style={styles.logo} />

        <Pressable
          style={styles.clickButton}
          onPress={() => router.push({ pathname: "/menu", params: { name: cafe.name } })}
        >
          <Text style={styles.clickText}>Click Here</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: { height: 260, marginBottom: 18 },
  cardImage: { borderRadius: 22 },
  overlay: {
    flex: 1,
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(53, 37, 42, 0.35)",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignSelf: "stretch" },
  info: { flex: 1, gap: 2 },
  name: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  address: { color: colors.cream, fontSize: 14 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { color: colors.beige, fontSize: 14, fontWeight: "600" },
  heartButton: { padding: 4 },
  logo: { width: 70, height: 70 },
  clickButton: {
    backgroundColor: colors.cream,
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  clickText: { color: colors.darkPink, fontWeight: "600" },
});
