import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { colors } from "../constants/colors";
import { AppProviders } from "../context/AppProviders";

export default function RootLayout() {
  // Prevent any white window flash by locking the root native window background to espresso
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.espresso).catch(() => {});
  }, []);

  return (
    <AppProviders>
      <StatusBar style="light" backgroundColor={colors.espresso} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.espresso },
          animation: "fade",
          animationDuration: 180,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="customized" />
        <Stack.Screen name="coffee-cart" />
        <Stack.Screen name="order-confirmation" />
        <Stack.Screen name="order-status" />
        <Stack.Screen name="order-history" />
      </Stack>
    </AppProviders>
  );
}
