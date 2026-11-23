import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProviders } from "../context/AppProviders";
import { colors } from "../constants/colors";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" backgroundColor={colors.espresso} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.espresso },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="menu"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="customized"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="coffee-cart"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="order-confirmation"
          options={{
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="order-status"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="order-history"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </AppProviders>
  );
}
