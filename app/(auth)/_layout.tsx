import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="studentRegister" />
      <Stack.Screen name="tutorRegister" />
      <Stack.Screen name="forgot" />
    </Stack>
  );
}
