import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Search, User, Calendar, Bell,SquareArrowOutUpRight } from 'lucide-react-native';

export default function UserLayout() {
  const INACTIVE_COLOR = '#313131';
  const ACTIVE_COLOR = '#115bca';
  const iconSize= 18
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 62 + insets.bottom,
          borderRadius: 50,
          marginHorizontal: 10,
          marginBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House color={color} size={iconSize} />,
        }}
      />
      
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
         tabBarIcon: ({color}) => <Calendar color={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="enquiry"
        options={{
          title: 'Enquiry',
          tabBarIcon: ({color}) => <SquareArrowOutUpRight color={color} size={iconSize} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
         tabBarIcon: ({color}) => <User color={color} size={iconSize} />,
        }}
      />
    </Tabs>
  );
}
