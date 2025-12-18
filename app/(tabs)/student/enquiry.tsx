// app/(tabs)/enquiry.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/components/ui/BackButton';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import EnquiryRequestCard from '@/components/EnquiryCard';
import { getMyEnquiriesAPI } from '@/services/enquiry';
import { EnquiryAPI } from '@/types/enquiry';
import { Pressable } from 'react-native';

const EnquiryTabScreen = () => {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<EnquiryAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyEnquiriesAPI();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch enquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 ">
      {/* Header */}
      <View className="flex-row items-center justify-around px-4 mt-1 mb-3">
        <BackButton />
        <Text className="text-2xl font-semibold ml-2">
          Your Enquiries
        </Text>
        <View className='bg-accent rounded-full p-2 '>
          <Pressable onPress={() => { router.push('/sections/OfflineStatus/BookOffline') }}>
            <Plus color="#115bca" size={24} />
          </Pressable>
        </View>
      </View>

      <View>

      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-2 text-sm text-gray-600">
            Loading enquiries...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 font-semibold mb-2">
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadEnquiries}
            className="px-4 py-2 rounded-xl bg-blue-600"
          >
            <Text className="text-white text-xs font-semibold">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : enquiries.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="font-semibold text-gray-800">
            No offline enquiries yet
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-1">
            Tap + to create a new offline enquiry.
          </Text>
        </View>
      ) : (
        <View className='px-3'>
          <FlatList
            data={enquiries}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <EnquiryRequestCard
                data={item}
                onPress={() =>
                  // router.push(`/sections/OfflineStatus/${item.id}`)
                  router.push('/')
                }
              />
            )}
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          />
        </View>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-accent items-center justify-center shadow-xl"
        onPress={() => router.push('/')}
      >
        <Plus color="#115bca" size={26} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EnquiryTabScreen;
