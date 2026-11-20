import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/colors";

const MOCK_EMAIL = "user@localcup.com";
const MOCK_PASSWORD = "123456";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const value = await AsyncStorage.getItem("isLoggedIn");
        if (active && value === "true") router.replace("/home");
      } catch (loadError) {
        console.error("Failed to check the saved login.", loadError);
        if (active) setError("Could not check your saved login. Please try again.");
      } finally {
        if (active) setCheckingSession(false);
      }
    };

    checkSession();
    return () => {
      active = false;
    };
  }, [router]);

  const handleLogin = async () => {
    if (checkingSession || signingIn) return;
    setError("");

    if (email.trim().toLowerCase() !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
      setError("Invalid email or password.");
      return;
    }

    setSigningIn(true);
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      router.replace("/home");
    } catch (loginError) {
      console.error("Failed to save the login.", loginError);
      setError("Could not log in. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>LocalCup1</Text>
        <Text style={styles.subtitle}>Luxury Artisanal Coffee</Text>

        <TextInput
          style={styles.input}
          placeholder="Email (user@localcup.com)"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (123456)"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={checkingSession || signingIn}
        >
          {checkingSession || signingIn ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.cream,
  },
  glassCard: {
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: colors.glassCard,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: 36,
    paddingHorizontal: 22,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  logo: { width: 80, height: 80 },
  title: { fontSize: 30, fontWeight: "bold", color: colors.white, letterSpacing: 0.3 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  input: {
    alignSelf: "stretch",
    backgroundColor: colors.glassInput,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.white,
  },
  error: { color: "#E74C3C", fontWeight: "600", fontSize: 13 },
  button: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ctaButton,
    minHeight: 52,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ctaBorder,
    marginTop: 8,
    shadowColor: colors.ctaButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold", letterSpacing: 0.3 },
});
