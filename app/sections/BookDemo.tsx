import AddressForm from '@/components/forms/AddressForm';
import { BackButton } from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import DOBPicker from '@/components/ui/DOBInput';
import Input from '@/components/ui/Input';
import TimePicker from '@/components/ui/TimePicker';
import { useRefreshStore } from '@/hooks/useRefreshStore';
import { BookDemoAPI } from '@/services/booking';
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
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    tutor_id: tutorId || '',
    contact_name: '',
    contact_email: '',
    contact_mobile: '',
    demo_date: '',
    demo_time: '',
    message: '',
    address: {
      street: '',
      city: '',
      state: '',
      pin_code: '',
      country: '',
    },
  });

  // Load user data
  useEffect(() => {
    if (!tutorId) {
      Alert.alert(
        'Error',
        'Tutor ID is missing. Please navigate from a valid tutor profile.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
      return;
    }

    const loadUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setFormData(prev => ({
            ...prev,
            tutor_id: tutorId,
            contact_name: user.username || '',
            contact_email: user.email || '',
            contact_mobile: user.mobile_number || '',
            address: {
              street: user.address?.street || '',
              city: user.address?.city || '',
              state: user.address?.state || '',
              pin_code: user.address?.pin_code || '',
              country: user.address?.country || '',
            },
          }));
        }
      } catch (err) {
        console.error('Failed to load user data', err);
      }
    };

    loadUserData();
  }, [tutorId, refreshToken]);

  const handleSubmit = async () => {
    if (!formData.tutor_id) {
      Alert.alert('Error', 'Tutor ID is missing');
      return;
    }

    const payload = {
      tutor_id: Number(formData.tutor_id),
      contact_name: formData.contact_name,
      contact_email: formData.contact_email,
      contact_mobile: formData.contact_mobile,
      demo_date: formData.demo_date,
      demo_time: formData.demo_time,
      message: formData.message,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        country: formData.address.country,
        pin_code: formData.address.pin_code,
      },
    };

    try {
      setLoading(true);
      console.log('Booking demo payload:', payload);

      const response = await BookDemoAPI(payload);

      if (response?.ok) {
        Alert.alert('Success', response.message || 'Demo booked successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        throw new Error(response?.message || 'Failed to book demo');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
      className="flex-1 w-[90%] mx-auto"
    >
      <View className="flex-row items-center justify-between py-2">
        <BackButton />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 2 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold text-primary text-center mb-6">
          Book Demo
        </Text>

        <Input
          label="Name"
          iconName="User"
          value={formData.contact_name}
          onChangeText={text =>
            setFormData(p => ({ ...p, contact_name: text }))
          }
        />

        <Input
          label="Email"
          iconName="Mail"
          keyboardType="email-address"
          value={formData.contact_email}
          onChangeText={text =>
            setFormData(p => ({ ...p, contact_email: text }))
          }
        />

        <Input
          label="Mobile Number"
          iconName="Phone"
          keyboardType="phone-pad"
          value={formData.contact_mobile}
          onChangeText={text =>
            setFormData(p => ({ ...p, contact_mobile: text }))
          }
        />

        <AddressForm
          address={formData.address}
          onChange={addr =>
            setFormData(prev => ({ ...prev, address: addr }))
          }
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />

        <DOBPicker
          label="Demo Date"
          icon="Calendar"
          value={formData.demo_date}
          onChange={date =>
            setFormData(p => ({ ...p, demo_date: date }))
          }
        />

        <TimePicker
          label="Demo Time"
          iconName="Clock"
          value={formData.demo_time}
          onChange={time =>
            setFormData(p => ({ ...p, demo_time: time }))
          }
        />

        <Input
          label="Message"
          iconName="MessageSquare"
          value={formData.message}
          onChangeText={text =>
            setFormData(p => ({ ...p, message: text }))
          }
          placeholder="Need demo for 10th CBSE Maths"
        />

        <View className="mt-6">
          <Button
            title="Book Demo"
            loading={loading}
            onPress={handleSubmit}
            icon="check"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookDemo;
