import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import Button from '../components/ui/Button';
import { useRouter } from 'expo-router';
import { Images } from '@/constants/images';
const { height } = Dimensions.get('window');

const cHeight = height * 0.45;
const Index: React.FC = () => {
  const router = useRouter();

  const handleLoginPress = (role: string) => {
    router.push({
      pathname: "/(auth)/login",
      params: { role },
    });
  };

  return (

    <View
      className="flex-1 mx-auto w-[85%] justify-center"
    >
      <View className="w-full mx-auto h-[40%] ">
        <Image
          source={Images.HomeScreenImage}
          style={{ width: '100%', height: '100%' }}
          className="rounded-2xl"
        />


      </View>
      {/* Hero Section */}
      <View className="items-center gap-3 mb-6 w-[90%] mx-auto">
        <Text className="text-3xl font-bold text-center text-slate-900 leading-tight mb-3">
          Find Your Perfect {"\n"} Home Tutor
        </Text>
        <Text className="text-lg text-center text-slate-600 leading-6">
          Connect with verified tutors for personalized learning
        </Text>
      </View>

      {/* CTA Buttons */}
      <View className="items-center gap-3">
        <Button
          title="Student"
          onPress={() => handleLoginPress('student')}
          className="w-[90%]"
          icon="search"
        />
        <Button
          title="Tutor"
          onPress={() => handleLoginPress('tutor')}
          outline={true}
          className="w-[90%]"
          icon="user-plus"
        />
      </View>
    </View>
  );
};

export default Index;
