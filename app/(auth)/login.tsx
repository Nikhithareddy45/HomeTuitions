import { View, Text, Alert, KeyboardAvoidingView, ScrollView, Platform, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFormReset } from '@/utils/useFormReset';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loginSchema } from '@/utils/validationYup';
import { LoginAPI } from '@/services/auth';
import { Link, useRouter } from 'expo-router';
import { useLocalSearchParams } from "expo-router";
import { Images } from '@/constants/images';
import { BackButton } from '@/components/ui/BackButton';

const Login: React.FC = () => {

  //studdent: test 123456
  //tutor : professor 123456
  const { role } = useLocalSearchParams();
  const router = useRouter();
  const defaultEmail = (role === 'student' ? 'test' : 'professor')
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
  useEffect(() => {
    const defaultEmail = role === 'student' ? 'test' : 'professor';
    setFormData(prev => ({ ...prev, username: defaultEmail }));
  }, [role]);


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
          'Login successfully',
          [{ text: 'OK', onPress: () => { } }],
        );
      }
      console.log(response.user.role);

      if (response.user.role === 'student') {
        router.push('/(tabs)/student')
      } else {
        router.push('/(tabs)/tutor')
      }

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
      className="flex-1 gap-5"
    >

      <View className='flex-1 gap-4 w-[90%] mx-auto relative'>
      <BackButton />
        <View className='h-[40%] w-full items-center justify-center overflow-hidden'>
          <Image source={role === 'student' ? Images.LoginStudentImage : Images.LoginTutorImage} />
        </View>
        <View className='w-[90%] flex-1 gap-6 h-auto mx-auto rounded-xl'>
          <View className='p-6'>
            <Text className='text-primary gap-4 text-3xl font-bold text-center mb-6 '>Login as {role} </Text>
            <View className='w-full mx-auto'>
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
            <View className='gap-3 mt-2'>
              <Button
                title="Login"
                loading={loading}
                onPress={handleSubmit}
                icon="check"
              />
              <View className='flex-row items-end justify-end'>
                <Link href='/(auth)/forgot'>
                  <Text className='text-primary font-bold'>Forgot Password?</Text>
                </Link>
              </View>
            </View>
          </View>

        </View>
      </View>
      {/* .... */}
      <View className='flex-row items-center justify-center gap-2 absolute bottom-0 w-full h-14 shadow-lg bg-white mx-auto'>
        <Text>Don&apos;t have an account?</Text>
        <Link href={role === 'student' ? '/(auth)/studentRegister' : '/(auth)/tutorRegister'}>
          <Text className='text-primary font-bold'>Sign Up</Text>
        </Link>
      </View>
    </KeyboardAvoidingView >
  )
}

export default Login