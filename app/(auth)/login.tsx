import { View, Text, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useFormReset } from '@/utils/useFormReset';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loginSchema } from '@/utils/validationYup';
import { LoginAPI } from '@/services/auth';
import { Link, useRouter } from 'expo-router';

const Login: React.FC = () => {
  //studdent: test 123456
  //tutor : professor 123456
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '123456'

  })
  const [errors, setErrors] = useState<Record<string, string>>({});
  const resetForm = () => {
    setFormData({
      username: '',
      password: ''
    });
    setErrors({});
  }
  useFormReset(resetForm)
  const handleChange = (key: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        username: formData.username,
        password: formData.password
      }
      try {
        await loginSchema.validate(payload, { abortEarly: false })
      } catch (validationErr: any) {
        const newErrors: Record<string, string> = {};
        if (validationErr.inner && validationErr.inner.length > 0) {
          validationErr.inner.forEach((err: any) => {
            if (err.path) {
              newErrors[err.path] = err.message;
            }
          });
        }
        setErrors(newErrors)
        const errorMessages = Object.entries(newErrors).map(([field, message]) => `❌ ${message}`).join('\n');
        Alert.alert(
          '⚠️ Validation Errors',
          `\n${errorMessages}\n\nPlease fix the errors above and try again.`,
          [{ text: 'OK', onPress: () => { } }],
        )
        setLoading(false)
        return;
      }
      const response = await LoginAPI(payload)
      if (!response.ok) {
        Alert.alert(
          'Success',
          'Student registered successfully',
          [{ text: 'OK', onPress: () => { } }],
        );
      }
      console.log('Register success:', response);

      // Reset state silently
      setFormData({
        ...formData
      });
      setErrors({});

    } catch (err: any) {
      const data = err?.response?.data
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
      setLoading(false)
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
      className="w-full h-full  flex-1 "
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 40 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        className="flex-1 w-[90%] mx-auto h-full "
      >
        <View className='flex-1 items-center justify-center '>
          <View className='gap-3 p-6 w-full mx-auto border-2 rounded-xl shadow-md border-gray-300'>
            <Text className='text-primary text-3xl font-bold text-center mb-3 '>Login</Text>
            <View className='w-[90%] mx-auto'>
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
                label="Password"
                iconName="Lock"
                secureTextEntry
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
                placeholder="Enter password"
                className="mb-4"
                error={errors.password}
              />
            </View>
            <View>
              <Button
                title="Login"
                loading={loading}
                onPress={handleSubmit}
                icon="check"
              />
            </View>
          </View>
          <View className='flex-row items-center justify-center mt-4 gap-2'>
            <Text>Don&apos;t have an account?</Text>
            <Link href="/(auth)/studentRegister">
              <Text className='text-primary font-bold'>Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView >
  )
}

export default Login