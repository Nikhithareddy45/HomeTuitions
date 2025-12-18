import { View, Text } from 'react-native'
import React from 'react'
import { BackButton } from '@/components/ui/BackButton'

const Notifications = () => {
  return (
    <View className='flex-1 p-6 '>
      <BackButton />
      <View className='w-full h-full items-center justify-center border-2'>
        <Text>No Notifications yet!!</Text>
      </View>
    </View>
  )
}

export default Notifications