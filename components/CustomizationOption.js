import { Text, Pressable, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "../constants/colors";

// Dark glass option pill matching the size/option chips in screenshot.
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
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassPill,
  },
  selectedButton: {
    backgroundColor: colors.glassPillActive,
    borderColor: colors.glassBorderActive,
  },
  text: { color: colors.textSecondary, fontSize: 13, fontWeight: "500" },
  selectedText: { color: colors.white, fontWeight: "600" },
});
