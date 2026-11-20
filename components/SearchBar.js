import { Search } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../constants/colors";

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.box}>
      <Search size={18} color={colors.textSecondary} />
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor={colors.textMuted}
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
    gap: 10,
    backgroundColor: colors.glassPill,
    borderRadius: 999,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  input: { flex: 1, paddingVertical: 12, color: colors.white, fontSize: 15 },
});
