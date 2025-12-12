import { BackButton } from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Images } from '@/constants/images';
import { LoginAPI } from '@/services/auth';
import { useRefreshStore } from '@/store/useRefreshStore';
import { useFormReset } from '@/utils/useFormReset';
import { loginSchema } from '@/utils/validationYup';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

const Login: React.FC = () => {
  const { role } = useLocalSearchParams();
  const router = useRouter();

  const defaultEmail = role === 'student' ? 'test' : 'professor';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: defaultEmail,
    password: '123456',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
  const refreshToken = useRefreshStore((state) => state.refreshToken);

  const resetForm = () => {
    setFormData({
      username: defaultEmail,
      password: '123456',
    });
    setErrors({});
  };

  useEffect(() => {
    const defaultEmail = role === 'student' ? 'test' : 'professor';
    setFormData({
      username: defaultEmail,
      password: '123456',
    });
    setErrors({});
  }, [role, refreshToken]);

  useFormReset(resetForm);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
      };

      // Validate
      try {
        await loginSchema.validate(payload, { abortEarly: false });
      } catch (validationErr: any) {
        const newErrors: Record<string, string> = {};
        validationErr.inner.forEach((err: any) => {
          if (err.path) newErrors[err.path] = err.message;
        });

        setErrors(newErrors);

        const errorMessages = Object.values(newErrors)
          .map((msg) => `❌ ${msg}`)
          .join('\n');

        Alert.alert('⚠️ Validation Errors', errorMessages);
        setLoading(false);
        return;
      }

      // API
      const response = await LoginAPI(payload);

      if (!response.ok) {
        Alert.alert('Success', 'Login successfully');
      }

      if (response.user.role === 'student') {
        router.push('/(tabs)/student');
      } else {
        router.push('/(tabs)/tutor');
      }

      // Silent reset
      setErrors({});
    } catch (err: any) {
      const data = err?.response?.data;

      if (data && typeof data === 'object') {
        const fieldErrors: Record<string, string> = {};
        const existenceErrors: string[] = [];

        Object.entries(data).forEach(([field, val]) => {
          const msg = Array.isArray(val) ? val.join(' ') : String(val);
          if (
            (field === 'username' || field === 'email') &&
            msg.toLowerCase().includes('exist')
          ) {
            existenceErrors.push(`❌ ${msg}`);
          } else {
            fieldErrors[field] = msg;
          }
        });

        if (existenceErrors.length > 0) {
          Alert.alert('⚠️ Registration Error', existenceErrors.join('\n'));
        }

        if (Object.keys(fieldErrors).length > 0) {
          Alert.alert(
            '⚠️ Validation Error',
            Object.values(fieldErrors).join('\n')
          );
        }
      } else {
        Alert.alert(
          '⚠️ Registration Error',
          err?.response?.data?.message || 'Something went wrong'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
      className="flex-1 gap-5"
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={triggerRefresh} />
        }
      >
        <View className="flex-1 gap-4 w-[90%] mx-auto relative">
          <BackButton />

          {/* Image */}
          <View className="h-[40%] w-full items-center justify-center">
            <Image
              source={
                role === 'student'
                  ? Images.LoginStudentImage
                  : Images.LoginTutorImage
              }
            />
          </View>

          {/* Form */}
          <View className="w-[90%] mx-auto gap-6 rounded-xl">
            <View className="p-6">
              <Text className="text-primary text-3xl font-bold text-center mb-6">
                Login as {role}
              </Text>

              <Input
                label="Username"
                iconName="User"
                value={formData.username}
                onChangeText={(text) => handleChange('username', text)}
                placeholder="Enter your username"
                error={errors.username}
              />

              <Input
                label="Password"
                iconName="Lock"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                placeholder="Enter password"
                error={errors.password}
                className="mt-4"
              />

              <View className="gap-3 mt-4">
                <Button
                  title="Login"
                  loading={loading}
                  onPress={handleSubmit}
                  icon="check"
                  className="w-[90%]"
                />

                <View className="flex-row justify-end">
                  <Link href="/(auth)/forgot">
                    <Text className="text-primary font-bold">
                      Forgot Password?
                    </Text>
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom link */}
        <View className="flex-row items-center justify-center gap-2 absolute bottom-0 w-full h-14 shadow-lg bg-white">
          <Text>Don&apos;t have an account?</Text>
          <Link
            href={
              role === 'student'
                ? '/(auth)/studentRegister'
                : '/(auth)/tutorRegister'
            }
          >
            <Text className="text-primary font-bold">Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
