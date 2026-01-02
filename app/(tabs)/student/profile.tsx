import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Pencil, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View
} from 'react-native';

import AddressForm from '@/components/forms/AddressForm';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AddressAPI, GetProfileAPI, UpdateStudentAPI } from '@/services/user';
import { UserData } from '@/types/authTypes';
import { getCurrentUser, setUserCache } from '@/utils/getUserFromStorage';

interface Address {
  street: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
}

const UserProfile: React.FC = () => {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [editedData, setEditedData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Load profile
  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      if (!currentUser?.id) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const data = await GetProfileAPI(String(currentUser.id));
      setUserData(data);
      setEditedData(data);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Do not reload while editing
  useFocusEffect(
    useCallback(() => {
      if (!isEditing) loadUserProfile();
    }, [isEditing, loadUserProfile])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  }, [loadUserProfile]);

  // 🔹 Save profile
  const handleSave = async () => {
    if (!editedData || !userData) return;

    const isProfileChanged =
      editedData.username !== userData.username ||
      editedData.mobile_number !== userData.mobile_number ||
      editedData.date_of_birth !== userData.date_of_birth ||
      editedData.student_class !== userData.student_class;

    const isAddressChanged =
      JSON.stringify(editedData.address) !== JSON.stringify(userData.address);

    if (!isProfileChanged && !isAddressChanged) {
      Alert.alert('No changes to save');
      return;
    }

    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser?.id) {
        Alert.alert('Error', 'User not found');
        return;
      }
      if (isProfileChanged) {
        const profilePayload = {
          username: editedData.username,
          date_of_birth: editedData.date_of_birth,
          student_class: editedData.student_class,
        }as any;
        

        await UpdateStudentAPI(profilePayload, String(currentUser.id));
      }

      // Update address if changed
      if (isAddressChanged && editedData.address) {
        console.log(currentUser.id)
        const addressPayload = {
          street: editedData.address.street,
          city: editedData.address.city,
          state: editedData.address.state,
          pin_code: editedData.address.pin_code,
          country: editedData.address.country,
        }as any;
        await AddressAPI(addressPayload, String(currentUser.id));
      }

      // Refresh user data
      const updatedUser = await GetProfileAPI(String(currentUser.id));
      setUserData(updatedUser);
      setEditedData(updatedUser);
      await setUserCache(updatedUser);

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (e: any) {
      console.error('Update error:', e);
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Failed to update profile. Please try again.'
      );
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
        <Text>Loading...</Text>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-8 mt-4 gap-2">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold">My Profile</Text>
            <Pressable
              onPress={() =>
                isEditing ? handleCancel() : setIsEditing(true)
              }
            >
              {isEditing ? <X size={20} color="red" /> : <Pencil size={20} />}
            </Pressable>
          </View>

          {/* Personal Info */}
          <View className="bg-white p-4 rounded-xl">
            <Input
              label="Username"
              value={editedData?.username || ''}
              editable={isEditing}
              iconName="User"
              onChangeText={t =>
                setEditedData(p => (p ? { ...p, username: t } : p))
              }
            />

            <Input
              label="Email"
              value={editedData?.email || ''}
              editable={false}
              iconName="Mail"
            />

            {/* <Input
              label="Mobile Number"
              value={editedData?.mobile_number || ''}
              editable={isEditing}
              iconName="Phone"
              onChangeText={t =>
                setEditedData(p =>
                  p ? { ...p, mobile_number: t } : p
                )
              }
                
            /> */}
             <Input
              label="Student Class"
              value={editedData?.student_class || ''}
              editable={isEditing}
              iconName="Book"
              onChangeText={t =>
                setEditedData(p =>
                  p ? { ...p, student_class: t } : p
                )
              }
                
            /> 
          </View>

          {/* Address */}
          <View className="bg-white p-4 rounded-xl">
            {editedData?.address ? (
              <AddressForm
                address={editedData.address as Address}
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
            <View className="flex-row gap-2">
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={loading}
                disabled={loading}
                className="w-[38%]"
                icon="check"
              />
              <Button
                title="Cancel"
                outline
                onPress={handleCancel}
                className="w-[38%]"
                icon="x"
              />
            </View>
          ) : (
            <Button title="Logout" outline onPress={handleLogout} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserProfile;
