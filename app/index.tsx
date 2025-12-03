import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import Button from '../components/ui/Button';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');
const cHeight = height * 0.45;
const LandingScreen: React.FC = () => {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('/(auth)/tutorRegister');
  };

  return (
    
      <View 
        className="flex-1 mx-auto w-[85%] justify-center" 
      >
        <View className="w-[100%] mx-auto">
          <Image source={require('../assets/images/homescreen2.png')} className="w-full rounded-2xl" style={{ height: cHeight }}/>
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
            title="Find Tutor"
            onPress={handleLoginPress}
            className="w-[90%]"
            icon="search"
          />
          <Button
            title="Become Tutor"
            onPress={handleLoginPress}
            outline={true}
            className="w-[90%]"
            icon="user-plus"
          />
        </View>
      </View>
  );
};

export default LandingScreen;
