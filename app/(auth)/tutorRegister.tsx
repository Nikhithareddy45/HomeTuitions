import { View, Text } from 'react-native'
import React, { useState } from 'react'

const tutorRegister = () => {
  const [loading,setLoading] = useState(false)
  const [step,setStep] = useState<1|2|3>(1);
  return (
    <View>
      <Text>tutorRegister</Text>
    </View>
  )
}

export default tutorRegister