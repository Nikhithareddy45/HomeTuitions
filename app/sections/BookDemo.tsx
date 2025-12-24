import AddressForm from '@/components/AddressComp';
import { BackButton } from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import DOBPicker from '@/components/ui/DOBInput';
import Input from '@/components/ui/Input';
import TimePicker from '@/components/ui/TimePicker';
import { BookDemoAPI } from '@/services/booking';
import { useRefreshStore } from '@/store/useRefreshStore';
import { getCurrentUser } from '@/utils/getUserFromStorage';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  const { tutorId } = useLocalSearchParams<{ tutorId?: string }>();
  const router = useRouter();
  const { refreshToken } = useRefreshStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    tutorId: tutorId || '',
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
  });
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Reset form when tutorId changes or refreshToken changes
  useEffect(() => {
    if (!tutorId) {
      Alert.alert(
        'Error',
        'Tutor ID is missing. Please navigate from a valid tutor profile.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
      return;
    }

    // Reset form with current user data
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setFormData(prev => ({
            ...prev,
            tutorId,
            username: currentUser.username || '',
            email: currentUser.email || '',
            mobile_number: currentUser.mobile_number || '',
            address: {
              ...prev.address,
              ...(currentUser.address || {})
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            tutorId,
            username: '',
            email: '',
            mobile_number: '',
            address: { ...prev.address }
          }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [tutorId, refreshToken]);

  
  const handleChange = (key: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };
  
  const handleSubmit = async () => {
    if (!formData.tutorId) {
      Alert.alert('Error', 'Tutor ID is missing. Please try again.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        tutorId: formData.tutorId,
        message: formData.message,
        demoDate: formData.demoDate,
        demoTime: formData.demoTime,
      };
      console.log("Frontend payload",payload)
      const response = await BookDemoAPI(payload);
      console.log("Backend response",response)
      
      if (response.ok) {
        Alert.alert(
          'Success',
          response.message || 'Demo booked successfully!',
          [
            {
              text: 'OK',
              onPress: async () => {
                // Reset form and go back
                try {
                  const currentUser = await getCurrentUser();
                  setFormData({
                    username: currentUser?.username || '',
                    tutorId: formData.tutorId,
                    email: currentUser?.email || '',
                    mobile_number: currentUser?.mobile_number || '',
                    address: {
                      street: currentUser?.address?.street || '',
                      city: currentUser?.address?.city || '',
                      state: currentUser?.address?.state || '',
                      pin_code: currentUser?.address?.pin_code || '',
                      country: currentUser?.address?.country || ''
                    },
                    demoDate: '',
                    demoTime: '',
                    message: ''
                  });
                  setSelectedLocation(null);
                } catch (error) {
                  console.error('Error resetting form:', error);
                }
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to book demo');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to book demo. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
      className="flex-1 w-[90%] mx-auto"
    >
      <View className="flex-row items-center justify-between py-2">
        <BackButton />
        <Button
          title="Reset"
          onPress={async () => {
            try {
              const currentUser = await getCurrentUser();
              setFormData(prev => ({
                ...prev,
                demoDate: '',
                demoTime: '',
                message: '',
                ...(currentUser && {
                  username: currentUser.username || '',
                  email: currentUser.email || '',
                  mobile_number: currentUser.mobile_number || '',
                  address: {
                    ...prev.address,
                    ...(currentUser.address || {})
                  }
                })
              }));
              setSelectedLocation(null);
            } catch (error) {
              console.error('Error resetting form:', error);
            }
          }}
          className="mr-4 bg-white border border-gray-300"
        />
      </View>
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
