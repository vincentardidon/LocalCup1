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
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>LocalCup1</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.dustyPink}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.dustyPink}
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
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
    gap: 14,
    backgroundColor: colors.cream,
  },
  logo: { width: 90, height: 90 },
  title: { fontSize: 32, fontWeight: "bold", color: colors.darkPink, marginBottom: 10 },
  input: {
    alignSelf: "stretch",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.beige,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  error: { color: colors.rose, fontWeight: "600" },
  button: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.darkPink,
    minHeight: 48,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
});