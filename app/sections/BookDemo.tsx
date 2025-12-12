import AddressForm from '@/components/AddressComp';
import { BackButton } from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import DOBPicker from '@/components/ui/DOBInput';
import Input from '@/components/ui/Input';
import TimePicker from '@/components/ui/TimePicker';
import { BookDemoAPI } from '@/services/booking';
import React, { useEffect, useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

const BookDemo: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    tutorId: '',
    email: '',
    mobile_number: '',
    address: {
      street: '',
      city: '',
      state: '',
      pin_code: '',
      country: ''
    },
    demoDate: '',
    demoTime: '',
    message: ''
  })
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const handleChange = (key: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      console.log(formData)
      const response = await BookDemoAPI(formData)
      if (!response.ok) {
        Alert.alert(
          'Success',
          `${response.message}`,
          [{ text: 'OK', onPress: () => { } }],
        );
      }
      console.log("Form submitted:", response);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
      className="flex-1 w-[90%] mx-auto"
    >
      <BackButton />
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 2 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-primary text-center mb-2">
            Book Demo
          </Text>

        </View>
        <View className="gap-2">
          <Input
            label="Username"
            iconName="User"
            value={formData.username}
            onChangeText={text => handleChange('username', text)}
            placeholder="Enter your username"
            className="mb-4"
          // error={errors.username}
          />
          <Input
            label="Email Address"
            iconName="Mail"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
            // error={errors.email}
            placeholder="your.email@example.com"
            className="mb-4"
          />
          <Input
            label="Mobile Number"
            iconName="Phone"
            keyboardType="phone-pad"
            value={formData.mobile_number}
            onChangeText={text => handleChange('mobile_number', text)}
            // error={errors.mobile_number}
            placeholder="Enter your mobile number"
            className="mb-4"
          />
          <AddressForm
            address={formData.address}
            onChange={addr => setFormData(prev => ({ ...prev, address: addr }))}
            selectedLocation={selectedLocation}
            onLocationChange={loc => setSelectedLocation(loc)}
          />
          <DOBPicker
            label="Booking Data"
            icon="Calendar"
            value={formData.demoDate}
            onChange={text => {
              handleChange('demoDate', text);
            }}
          />

          <TimePicker
            label="Start Time"
            iconName="Clock"
            value={formData.demoTime}
            onChange={time => handleChange('demoTime', time)}
          />
          <Input
            label="Message"
            iconName="MessageSquare"
            value={formData.message}
            onChangeText={text => handleChange('message', text)}
            // error={errors.mobile_number}
            placeholder="Enter your message"
            className="mb-4"
          />
          <View className="flex-row justify-between mt-4">
            <View className="flex-1 ml-3">
              <Button
                title="Register"
                loading={loading}
                onPress={handleSubmit}
                icon="check"
                className='w-[90%]'
              />
            </View>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default BookDemo;
