import '../global.css'
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { useEffect } from 'react';
import SafeArea from '@/components/ui/SafeArea';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    //  <KeyboardAwareScrollView
    //     contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
    //     keyboardShouldPersistTaps="handled"
    //     enableOnAndroid={true}
    //     extraScrollHeight={10}
    //     showsVerticalScrollIndicator={true}
    //   >
      <SafeArea>
      <Stack >
        <Stack.Screen name="index" options={{ headerShown: false }} />
         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </SafeArea>
    // </KeyboardAwareScrollView>

  )
}
