import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../constants/colors";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { isLoggedIn, isLoadingSession, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // Lifecycle: Redirect immediately if user is already authenticated
  useEffect(() => {
    if (!isLoadingSession && isLoggedIn) {
      router.replace("/home");
    }
  }, [isLoadingSession, isLoggedIn, router]);

  const handleLogin = async () => {
    if (isLoadingSession || signingIn) return;
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSigningIn(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/home");
      } else {
        setError("Invalid email or password. Use user@localcup.com / 123456");
      }
    } catch (loginError) {
      console.error("[Login] Exception during login:", loginError);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  if (isLoadingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.caramel} />
      </View>
    );
  }

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
          onChangeText={(val) => {
            setEmail(val);
            if (error) setError("");
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (123456)"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (error) setError("");
          }}
        />

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={styles.button}
          onPress={handleLogin}
          disabled={signingIn}
        >
          {signingIn ? (
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  error: { color: "#E74C3C", fontWeight: "600", fontSize: 13, textAlign: "center" },
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
