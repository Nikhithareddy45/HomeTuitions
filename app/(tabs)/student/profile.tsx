import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Pencil, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import AddressForm from '@/components/AddressComp';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { GetProfileAPI, UpdateStudentAPI } from '@/services/user';
import { getCurrentUser, setUserCache } from '@/utils/getUserFromStorage';

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
  date_of_birth?: string;
  student_class?: string;
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

  // 🔹 Load profile (SAFE)
  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      if (!currentUser?.id) {
        Alert.alert('Error', 'User not found, please login again.');
        return;
      }

      const data = await GetProfileAPI(String(currentUser.id));
      setUserData(data);

      // ⚠️ Only initialize editedData ONCE
      setEditedData(prev => (prev ? prev : data));
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 DO NOT reload while editing
  useFocusEffect(
    useCallback(() => {
      if (!isEditing) {
        loadUserProfile();
      }
    }, [loadUserProfile, isEditing])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  }, [loadUserProfile]);

  // 🔹 Save profile
  const handleSave = async () => {
    if (!editedData) return;

    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      if (!currentUser?.id) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const payload = {
        userid: currentUser.id,
        username: editedData.username,
        mobile_number: editedData.mobile_number,
        date_of_birth: editedData.date_of_birth,
        student_class: editedData.student_class,
        address: {
          street: editedData.address?.street || '',
          city: editedData.address?.city || '',
          state: editedData.address?.state || '',
          pin_code: editedData.address?.pin_code || '',
          country: editedData.address?.country || '',
        },
      };

      console.log('FINAL PAYLOAD:', payload.address);

      const updatedUser = await UpdateStudentAPI(payload, String(currentUser.id));

      setUserData(updatedUser);
      setEditedData(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUserCache(updatedUser);

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
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
      <SafeAreaView className="flex-1 items-center justify-center">
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4 mt-4 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold">My Profile</Text>
            <Pressable onPress={() => (isEditing ? handleCancel() : setIsEditing(true))}>
              {isEditing ? <X size={20} color="red" /> : <Pencil size={20} />}
            </Pressable>
          </View>

          {/* Personal Info */}
          <View className="bg-white p-4 rounded-xl">
            <Input
              label="Username"
              value={editedData?.username || ''}
              editable={isEditing}
              onChangeText={t =>
                setEditedData(p => (p ? { ...p, username: t } : p))
              }
            />

            <Input
              label="Email"
              value={editedData?.email || ''}
              editable={false}
            />

            <Input
              label="Mobile Number"
              value={editedData?.mobile_number || ''}
              editable={isEditing}
              onChangeText={t =>
                setEditedData(p => (p ? { ...p, mobile_number: t } : p))
              }
            />
          </View>

          {/* Address */}
          <View className="bg-white p-4 rounded-xl">
            {editedData?.address ? (
              <AddressForm
                address={editedData.address}
                editable={isEditing}
                selectedLocation={null}
                onLocationChange={() => {}}
                onChange={addr =>
                  setEditedData(p =>
                    p ? { ...p, address: addr } : p
                  )
                }
              />
            ) : (
              <Text>No address added</Text>
            )}
          </View>

          {/* Buttons */}
          {isEditing ? (
            <>
              <Button title="Save Changes" onPress={handleSave} />
              <Button title="Cancel" outline onPress={handleCancel} />
            </>
          ) : (
            <Button title="Logout" outline onPress={handleLogout} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserProfile;
