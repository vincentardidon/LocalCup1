import { Search } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../constants/colors";

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.box}>
      <Search size={20} color={colors.rose} />
      <TextInput
        style={styles.input}
        placeholder="Search cafes..."
        placeholderTextColor={colors.dustyPink}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.beige,
  },
  input: { flex: 1, paddingVertical: 12, color: colors.text, fontSize: 16 },
});