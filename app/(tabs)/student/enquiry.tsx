import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { BackButton } from '@/components/ui/BackButton'

const enquiry = () => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="px-4"
          >
            <View className="flex-row items-center ml-3 mb-3 ">
              <BackButton />
              <Text className="text-2xl font-semibold ml-2">
                Your Enquiries
              </Text>
            </View>
            <View>
              
            </View>  
          </ScrollView>
    </SafeAreaView>
  )
}

export default enquiry