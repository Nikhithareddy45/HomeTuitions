import { setUserCache } from '@/utils/getUserFromStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { Alert } from "react-native";

export const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          setUserCache(null);
          router.replace({ pathname: '/(auth)/login', params: { role: 'student' } });
        },
      },
    ]);
  };

export const movetoNotifications = ()=>{
 router.push('/sections/Notifications') 
}