import { View, Text } from 'react-native'
import React from 'react'
import { Frown } from 'lucide-react-native';
const bookings = () => {
  return (
    <View className='flex-1 items-center justify-center gap-3'>
      <Text className='text-2xl font-semibold'>No Bookings till now </Text>
        <Frown />
    </View>
  )
}

export default bookings