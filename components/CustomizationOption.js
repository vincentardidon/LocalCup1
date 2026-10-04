import { Text, Pressable, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "../constants/colors";

// One selectable button. It looks different (and shows a check) when selected.
export default function CustomizationOption({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, selected && styles.selectedButton]}>
      {selected && <Check size={14} color={colors.white} />}
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.dustyPink,
    backgroundColor: colors.white,
  },
  selectedButton: { backgroundColor: colors.darkPink, borderColor: colors.darkPink },
  text: { color: colors.text, fontSize: 14 },
  selectedText: { color: colors.white, fontWeight: "600" },
});
