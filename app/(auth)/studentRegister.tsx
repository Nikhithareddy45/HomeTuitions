import AddressForm from '@/components/AddressComp';
import Button from '@/components/ui/Button';
import DOBPicker from '@/components/ui/DOBInput';
import Input from '@/components/ui/Input';
import { registerStudent } from '@/services/auth';
import { useFormReset } from '@/utils/useFormReset';
import {
  studentRegistrationSchema
} from '@/utils/validationYup';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';


const StudentRegistrationSinglePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState({
    username: 'nikhh',
    email: 'nikkireddyperugu@gmail.com',
    mobile_number: '1234567890',
    password: '123456',
    confirm_password: '123456',
    date_of_birth: '2000-01-01',
    student_class: '10',
    address: {
      street: 'Moosapet',
      city: 'Hyderabad',
      state: 'Telangana',
      pin_code: '500001',
      country: 'India',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      username: 'nikhh',
      email: 'nikkireddyperugu@gmail.com',
      mobile_number: '1234567890',
      password: '123456',
      confirm_password: '123456',
      date_of_birth: '2000-01-01',
      student_class: '10',
      address: {
        street: 'Moosapet',
        city: 'Hyderabad',
        state: 'Telangana',
        pin_code: '500001',
        country: 'India',
      },
    });
    setErrors({});
    setSelectedLocation(null);
    setCurrentStep(1);
  };

  useFormReset(resetForm);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };

  const handleAddressChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        mobile_number: formData.mobile_number,
        date_of_birth: formData.date_of_birth,
        student_class: formData.student_class,
        password: formData.password,
        confirm_password: formData.confirm_password,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          pin_code: formData.address.pin_code,
          country: formData.address.country,
        },
      };

      try {
        await studentRegistrationSchema.validate(payload, { abortEarly: false });
      } catch (validationErr: any) {
        const newErrors: Record<string, string> = {};
        if (validationErr.inner && validationErr.inner.length > 0) {
          validationErr.inner.forEach((err: any) => {
            if (err.path) {
              newErrors[err.path] = err.message;
            }
          });
        }
        setErrors(newErrors);
        const errorMessages = Object.entries(newErrors)
          .map(([field, message]) => `❌ ${message}`)
          .join('\n');
        Alert.alert(
          '⚠️ Validation Errors',
          `\n${errorMessages}\n\nPlease fix the errors above and try again.`,
          [{ text: 'OK', onPress: () => { } }],
        );
        setLoading(false);
        return;
      }

      const response = await registerStudent(payload);
      if (!response.ok) {
        Alert.alert(
          'Success',
          `${response.message}`,
          [{ text: 'OK', onPress: () => { } }],
        );
      }
      console.log('Register success:', response);

      // Reset state silently
      setFormData({
        ...formData
      });
      setErrors({});
      setSelectedLocation(null);
      setCurrentStep(1);
    } catch (err: any) {
      // Suppress console error to avoid black error message at bottom
      const data = err?.response?.data;

      if (data && typeof data === 'object') {
        const fieldErrors: Record<string, string> = {};
        const existenceErrors: string[] = [];

        Object.entries(data).forEach(([field, val]) => {
          const msg = Array.isArray(val) ? val.join(' ') : String(val);

          // Check if it's an existence error (username/email already exists)
          if ((field === 'username' || field === 'email') &&
            (msg.toLowerCase().includes('exist') || msg.toLowerCase().includes('already'))) {
            existenceErrors.push(`❌ ${msg}`);
          } else {
            fieldErrors[field] = msg;
          }
        });

        // Show existence errors as popup alert
        if (existenceErrors.length > 0) {
          Alert.alert(
            '⚠️ Registration Error',
            `\n${existenceErrors.join('\n')}\n\nPlease use different credentials and try again.`,
            [{ text: 'OK', onPress: () => { } }],
          );
        }
        if (Object.keys(fieldErrors).length > 0) {
          const otherErrors = Object.entries(fieldErrors)
            .map(([field, msg]) => `❌ ${msg}`)
            .join('\n');
          Alert.alert(
            '⚠️ Validation Error',
            `\n${otherErrors}`,
            [{ text: 'OK', onPress: () => { } }],
          );
        }
      } else {
        Alert.alert(
          '⚠️ Registration Error',
          err?.response?.data?.message || err.message || 'Registration failed',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => setCurrentStep(2);

  const goPrev = () => setCurrentStep(1);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
      className="flex-1 w-[90%] mx-auto"
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 40 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-primary text-center mb-2">
            Student Registration
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            {currentStep === 1 ? 'Personal Information' : 'Address Information'}
          </Text>
        </View>

        <View className="flex-row justify-center mb-8">
          <View className="flex-row items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${currentStep === 1 ? 'bg-primary' : 'bg-gray-300'
                }`}
            >
              <Text className="text-white font-bold">1</Text>
            </View>
            <View className="w-12 h-1 bg-gray-300 mx-2" />
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${currentStep === 2 ? 'bg-primary' : 'bg-gray-300'
                }`}
            >
              <Text className="text-white font-bold">2</Text>
            </View>
          </View>
        </View>


        {currentStep === 1 && (
          <View className="gap-2">
            <Input
              label="Username"
              iconName="User"
              value={formData.username}
              onChangeText={text => handleChange('username', text)}
              placeholder="Enter your username"
              className="mb-4"
              error={errors.username}
            />
            <Input
              label="Email Address"
              iconName="Mail"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="your.email@example.com"
              className="mb-4"
              error={errors.email}
            />
            <Input
              label="Mobile Number"
              iconName="Phone"
              keyboardType="phone-pad"
              value={formData.mobile_number}
              onChangeText={text => handleChange('mobile_number', text)}
              placeholder="Enter your mobile number"
              className="mb-4"
              error={errors.mobile_number}
            />
            <DOBPicker
              label="Date of Birth"
              icon="Calendar"
              value={formData.date_of_birth}
              onChange={async (text) => {
                handleChange('date_of_birth', text);
              }}
              error={errors.date_of_birth}
            />
            <Input
              label="Student Class"
              iconName="Briefcase"
              value={formData.student_class}
              onChangeText={text => handleChange('student_class', text)}
              placeholder="e.g., 10th Grade"
              className="mb-4"
              error={errors.student_class}
            />
            <Input
              label="Password"
              iconName="Lock"
              secureTextEntry
              value={formData.password}
              onChangeText={text => handleChange('password', text)}
              placeholder="Enter password"
              className="mb-4"
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              iconName="Lock"
              secureTextEntry
              value={formData.confirm_password}
              onChangeText={text => handleChange('confirm_password', text)}
              placeholder="Confirm password"
              className="mb-8"
              error={errors.confirm_password}
            />

            <Button
              title="Next"
              onPress={goNext}
              icon="arrow-right"
              className="mt-4"
            />
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <AddressForm
              address={formData.address}
              onChange={addr => setFormData(prev => ({ ...prev, address: addr }))}
              selectedLocation={selectedLocation}
              onLocationChange={loc => setSelectedLocation(loc)}
            />

            <View className="flex-row justify-between mt-4">
              <View className="flex-1 mr-3">
                <Button
                  title="Previous"
                  outline
                  onPress={goPrev}
                  icon="arrow-left"
                />
              </View>
              <View className="flex-1 ml-3">
                <Button
                  title="Register"
                  loading={loading}
                  onPress={handleSubmit}
                  icon="check"
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StudentRegistrationSinglePage;
