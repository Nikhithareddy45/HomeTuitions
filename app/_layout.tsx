import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from 'react';
import { ActivityIndicator, LogBox, Text, View } from 'react-native';
import '../global.css';
import SafeArea from '@/components/ui/SafeArea';

LogBox.ignoreAllLogs();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "SatoshiRegular": require("../assets/fonts/SatoshiRegular.ttf"),
    "SatoshiMedium": require("../assets/fonts/SatoshiMedium.ttf"),
    "SatoshiBold": require("../assets/fonts/SatoshiBold.ttf"),
    "SatoshiBlack": require("../assets/fonts/SatoshiBlack.ttf"),
    "SatoshiLight": require("../assets/fonts/SatoshiLight.ttf"),

  });

  useEffect(() => {
    if (fontsLoaded) {
    }
    if (fontError) {
      console.error('❌ Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Loading fonts...</Text>
      </View>
    );
  }

  if (fontError) {
    return (
      <View className="flex-1 items-center justify-center bg-red-50">
        <Text className="text-red-600 text-center px-8">
          Font failed to load: {fontError.message}
        </Text>
      </View>
    );
  }

  return (
   <SafeArea>
     <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
   </SafeArea>
  );
}
