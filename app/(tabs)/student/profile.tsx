import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable, Alert, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Camera, LogOut, X, Check, Pencil } from 'lucide-react-native';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { GetProfileAPI, UpdateStudentAPI } from '@/services/user';
import { getCurrentUser, setUserCache } from '@/utils/getUserFromStorage';
import { queryClient } from '@/utils/reactQueryClient';

interface Address {
  street: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  mobile_number: string;
  role: string;
  profile_image?: string;
  address?: Address;
}

const UserProfile: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const loadUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        Alert.alert('Error', 'User not found, please login again.');
        return;
      }

      const data = await GetProfileAPI(currentUser.id.toString());
      setUserData(data);
      setEditedData(data);
      setImageUri(data.profile_image || null);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadUserProfile(); }, [loadUserProfile]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  }, [loadUserProfile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!editedData) return;
    try {
       const payload = {
        username: editedData.username,
        email: editedData.email,
        mobile_number: editedData.mobile_number,
        // date_of_birth: editedData.date_of_birth,
        // student_class: editedData.student_class,
        // password: editedData.password,
        // confirm_password: formData.confirm_password,
        address: {
          street: editedData.address?.street,
          city: editedData.address?.city,
          state: editedData.address?.state,
          pin_code: editedData.address?.pin_code,
          country: editedData.address?.country,
        },
      };
      setLoading(true);
      const updatedUser = await UpdateStudentAPI(payload, editedData.id.toString());
      console.log(updatedUser)
      setUserData(updatedUser);
      setEditedData(updatedUser);
      setUserCache(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setImageUri(userData?.profile_image || null);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          setUserCache(null);
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (loading && !userData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="pt-5 pb-24">
          <View className="flex-row items-center justify-between px-4">
            <View />
            <Text className="text-white text-xl font-bold">My Profile</Text>
            <Pressable onPress={() => (isEditing ? handleCancel() : setIsEditing(true))}>
              <View className="w-9 h-9 bg-white/20 rounded-full items-center justify-center">
                {isEditing ? <X size={18} color="red" /> : <Pencil size={18} color="black" />}
              </View>
            </Pressable>
          </View>

          {/* Profile Image */}
          {/* <View className="items-center mt-4">
            <View className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white">
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              ) : (
                <View className="w-full h-full bg-primary/10 items-center justify-center">
                  <User size={40} color="#337ab7" />
                </View>
              )}
              {isEditing && (
                <Pressable
                  onPress={pickImage}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white"
                >
                  <Camera size={14} color="white" />
                </Pressable>
              )}
            </View>
            <Text className="text-white text-lg mt-2">{editedData?.username}</Text>
            <Text className="text-white/80">{editedData?.role}</Text>
          </View> */}
        </View>

        {/* Form */}
        <View className="-mt-16 px-4 ">
          {/* Username & Email */}
          <View className="bg-white rounded-xl p-4 mb-4">
            <Input
              label="Username"
              value={editedData?.username || ''}
              onChangeText={(text) => setEditedData(prev => prev ? { ...prev, username: text } : prev)}
              placeholder="Enter username"
              editable={isEditing}
              iconName="User"
            />
            <Input
              label="Email"
              value={editedData?.email || ''}
              onChangeText={(text) => setEditedData(prev => prev ? { ...prev, email: text } : prev)}
              placeholder="Enter email"
              editable={isEditing}
              iconName="Mail"
            />
            <Input
              label="Mobile Number"
              value={editedData?.mobile_number || ''}
              onChangeText={(text) => setEditedData(prev => prev ? { ...prev, mobile_number: text } : prev)}
              placeholder="Enter mobile number"
              editable={isEditing}
              iconName="Phone"
            />
          </View>

          {/* Address */}
          {editedData?.address && (
            <View className="bg-white rounded-xl p-4 mb-4 s">
              {['street', 'city', 'state', 'pin_code', 'country'].map(field => (
                <View key={field} className="mb-3">
                  <Input
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={editedData.address?.[field as keyof Address] || ''}
                    onChangeText={(text) =>
                      setEditedData(prev => prev ? { ...prev, address: { ...prev.address!, [field]: text } } : prev)
                    }
                    placeholder={`Enter ${field}`}
                    editable={isEditing}
                    iconName={field === 'street' ? 'MapPin' : undefined}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Buttons */}
          {isEditing ? (
            <View className="mb-4">
              <Button
                title="Save Changes"
                onPress={handleSave}
                className="bg-primary mb-3 rounded-xl"
                icon="Check"
              />
              <Pressable onPress={handleCancel} className="bg-gray-100 py-4 rounded-xl items-center flex-row justify-center">
                <X size={18} color="#666" />
                <Text className="ml-2 text-gray-600">Cancel</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={handleLogout} className="bg-white rounded-xl mb-4 flex-row items-center p-4 shadow">
              <LogOut size={20} color="#ef4444" />
              <Text className="ml-3 text-red-500 font-bold flex-1">Logout</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserProfile;
