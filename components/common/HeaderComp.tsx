import { View, Text } from 'react-native'
import React from 'react'
import { Images } from '@/constants/images';
import { LogOut, Bell } from 'lucide-react-native';
import { Image,Pressable } from 'react-native';
import { handleLogout, movetoNotifications } from '@/helpers/helpers';
export const HeaderComp = () => {
    
  return (
    <View className="rounded-full flex-row items-center justify-between mx-4 my-2 p-2 ">
        <View className="flex-row items-center gap-2">
          <Image
            source={Images.Logo}
            className="w-12 h-12 rounded-full"
            resizeMode="contain"
          />
          <Text className="text-lg font-bold">Home Tuitions</Text>
        </View>
        <View className="flex-row items-center gap-6">
            <Pressable onPress={movetoNotifications}>
            <Bell color="#2673d6ff"/>
          </Pressable>
          <Pressable onPress={handleLogout}>
            <LogOut color="#e05555ff"/>
          </Pressable>         
        </View>
      </View>
  )
}